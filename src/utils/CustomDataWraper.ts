//import ByteArray  from "bytearray-node"
//const bytearray : any = require("bytearray-node")

export default class CustomDataWrapper {

   private static INT_SIZE: number = 32;

   private static SHORT_SIZE: number = 16;

   private static SHORT_MIN_VALUE: number = -32768;

   private static SHORT_MAX_VALUE: number = 32767;

   private static UNSIGNED_SHORT_MAX_VALUE: number = 65536;

   private static CHUNCK_BIT_SIZE: number = 7;

   private static MAX_ENCODING_LENGTH: number = Math.ceil(CustomDataWrapper.INT_SIZE / CustomDataWrapper.CHUNCK_BIT_SIZE);

   private static MASK_10000000: number = 128;

   private static MASK_01111111: number = 127;


   private _data: Buffer;

   private position: number;

   constructor(data: Buffer = Buffer.alloc(0), position: number = 0) {
      this._data = data
      this.position = position;
   }

   public getBuffer = (): Buffer => {
      return this._data
   }

   public read(type: string) {
      switch (type) {
         case "UnsignedByte":
         return this.readUnsignedByte()
         case "UnsignedShort":
            return this.readUnsignedShort()
         case "Short":
            return this.readShort()
         case "VarLong":
            //return this.readVarLong()
         case "VarUhInt":
         case "VarInt":
            return this.readVarInt()
         case "Boolean":
            return this.readBoolean()
         case "UTF":
            return this.readUTF()
         case "VarShort":
         case "VarUhShort":
            return this.readVarUhShort()
         case "Int":
            return this.readInt()
         case "Byte":
            return this.readByte()
         case "Double":
            return this.readDouble()
         default:
            throw new Error(`${type} not implemented`)
      }
   }


   public write(type: string, value: any) {

      switch (type) {
         case "UnsignedShort":
         case "Short":
            return this.writeShort(value)
         case "VarLong":
         //   return this.writeVarLong(value)
         case "VarUhInt":
         case "VarInt":
            return this.writeVarInt(value)
         case "Boolean":
            return this.writeBoolean(value)
         case "UTF":
            return this.writeUTF(value)
         case "VarUhShort":
            return this.writeVarShort(value)
         case "Int":
            return this.writeInt(value)
         case "Byte":
            return this.writeByte(value)
         case "Double":
            return this.writeDouble(value)
         
         default:
            throw new Error(`${type} not implemented`)
      }
   }

   public readShort(): number {
      let res = this._data.readInt16BE(this.position)
      this.position += 2
      return res
   }

   public readVarInt(): number {
      var b: number = 0;
      var value: number = 0;
      var offset: number = 0;
      for (var hasNext: boolean = false; offset < CustomDataWrapper.INT_SIZE;) {
         b = this.readByte()

         hasNext = (b & CustomDataWrapper.MASK_10000000) == CustomDataWrapper.MASK_10000000;
         if (offset > 0) {
            value = value + ((b & CustomDataWrapper.MASK_01111111) << offset);
         }
         else {
            value = value + (b & CustomDataWrapper.MASK_01111111);
         }
         offset = offset + CustomDataWrapper.CHUNCK_BIT_SIZE;
         if (!hasNext) {
            return value;
         }
      }
      throw new Error("Too much data");
   }

   public readVarUhInt(): number {
      return this.readVarInt();
   }

   public readVarShort(): number {
      /* let res = this.readVarInt();
       if (res > CustomDataWrapper.SHORT_MAX_VALUE || res < CustomDataWrapper.SHORT_MIN_VALUE)
          throw Error("short EXCEEDED")
       return res*/
      var b: number = 0;
      var value: number = 0;
      var offset: number = 0;
      for (var hasNext: any = false; offset < CustomDataWrapper.SHORT_SIZE;) {
         b = this.readByte()

         hasNext = (b & CustomDataWrapper.MASK_10000000) == CustomDataWrapper.MASK_10000000;
         if (offset > 0) {
            value = value + ((b & CustomDataWrapper.MASK_01111111) << offset);
         }
         else {
            value = value + (b & CustomDataWrapper.MASK_01111111);
         }
         offset = offset + CustomDataWrapper.CHUNCK_BIT_SIZE;
         if (!hasNext) {
            if (value > CustomDataWrapper.SHORT_MAX_VALUE) {
               value = value - CustomDataWrapper.UNSIGNED_SHORT_MAX_VALUE;
            }
            return value;
         }
      }
      throw new Error("Too much data");

   }

   public readVarUhShort(): number {
      return this.readVarShort();
   }
   public readByte(): number {
      let b = this._data.readIntBE(this.position, 1);
      this.position++;
      return b
   }
   public readDouble(): number {
      let b = this._data.readDoubleBE(this.position);
      this.position += 8;
      return b
   }

   public readUTF(): string {
      const { StringDecoder } = require('string_decoder');
      const decoder = new StringDecoder('utf8');
      let length = this._data.readIntBE(this.position, 2)
      this.position += 2
      let buff = Buffer.alloc(length)
      for (let i = 0; i < length; i++)
         buff[i] = this.readByte()
      let res = decoder.write(buff)
      return res;
   }

   public readUnsignedShort(): number {
      let b = this._data.readUInt16BE(this.position);
      this.position += 2
      return b;
   }

   public readInt(): number {
      let b = this._data.readIntBE(this.position, 4);
      this.position += 4
      return b;
   }
   public readBoolean(): boolean {
      return this.readByte() != 0;
   }


   public writeByte(value: number): void {
      let buff = Buffer.alloc(1)
      buff.writeUIntBE(value & 255, 0, 1)
      this._data = Buffer.concat([this._data, buff])
   }
   public writeBytes(value: Buffer): void {
      this._data = Buffer.concat([this._data, value])

   }

   public writeVarInt(value: number): void {
      if (value >= 0 && value <= CustomDataWrapper.MASK_01111111) {
         this.writeByte(value);
         return;
      }
      var b: number = 0;
      var c: number = value;
      for (; c != 0;) {
         b = c & CustomDataWrapper.MASK_01111111
         c = c >>> CustomDataWrapper.CHUNCK_BIT_SIZE;
         if (c > 0) {
            b = b | CustomDataWrapper.MASK_10000000;
         }
         this.writeByte(b)
      }
   }
   public writeVarShort(value: number): void {
      if (value > CustomDataWrapper.SHORT_MAX_VALUE || value < CustomDataWrapper.SHORT_MIN_VALUE) {
         throw new Error("Forbidden value");
      }

      if (value >= 0 && value <= CustomDataWrapper.MASK_01111111) {
         this.writeByte(value);
         return;
      }
      var b: number = 0;
      var c: number = value;
      for (; c != 0;) {
         b = c & CustomDataWrapper.MASK_01111111
         c = c >>> CustomDataWrapper.CHUNCK_BIT_SIZE;
         if (c > 0) {
            b = b | CustomDataWrapper.MASK_10000000;
         }
         this.writeByte(b)
      }
   }

   public writeShort(value: number): void {
      let buff = Buffer.alloc(2)
      buff.writeInt16BE(value, 0)
      this._data = Buffer.concat([this._data, buff])
   }
   public writeUTF(value: string): void {
      this.writeShort(value.length);
      let buff = new Buffer(value)
      this._data = Buffer.concat([this._data, buff])
   }


   public writeInt(value: number): void {
      let buff = Buffer.alloc(4)
      buff.writeInt32BE(value, 0)
      this._data = Buffer.concat([this._data, buff])
   }
   public writeBoolean(value: boolean): void {
      let buff = Buffer.alloc(1)
      buff.writeIntBE(value ? 1 : 0, 0, 1)
      this._data = Buffer.concat([this._data, buff])
   }
   public writeDouble(value: number): void {
      let buff = Buffer.alloc(8)
      buff.writeDoubleBE(value, 0)
      this._data = Buffer.concat([this._data, buff])
   }
   public readVarLong(): number {
      let res = this.readInt64();
      return res;
   }
   public readUnsignedByte(){
      let b = this._data.readUIntBE(this.position,1)
      this.position++
      return b
   }
   private readInt64() : number
   {
      var b:number = 0;
      var result ={low :0, high : 0}
      var i:number = 0;
      while(true)
      {
         b = this.readUnsignedByte();
         if(i == 28)
         {
            break;
         }
         if(b >= 128)
         {
            result.low = result.low | (b & 127) << i;
            i = i + 7;
            continue;
         }
         result.low = result.low | b << i;
         console.log(result)

         return result.low + result.high;
      }
      if(b >= 128)
      {
         b = b & 127;
         result.low = result.low | b << i;
         result.high = b >>> 4;
         i = 3;
         while(true)
         {
            b = this.readUnsignedByte();
            if(i < 32)
            {
               if(b >= 128)
               {
                  result.high = result.high | (b & 127) << i;
               }
               else
               {
                  break;
               }
            }
            i = i + 7;
         }
         result.high = result.high | b << i;
      console.log(result)

         return result.low + result.high;
      }
      result.low = result.low | b << i;
      result.high = b >>> 4;
      console.log(result)
      return result.low + result.high;
   }
   
   public writeVarLong(value:number) : void
   {
      var i:number = 0;
      var val={low:0,high:0}
         val.low = value & Number.parseInt("0000FFFF",16)
         val.high = value & Number.parseInt("FFFF0000",16)
         console.log(value,val, val.high+ val.low)
      if(val.high == 0)
      {
         this.writeInt(val.low);
      }
      else
      {
         for(i = 0; i < 4; )
         {
            this.writeByte(val.low & 127 | 128);
            val.low = val.low >>> 7;
            i++;
         }
         if((val.high & 268435455 << 3) == 0)
         {
            this.writeByte(val.high << 4 | val.low);
         }
         else
         {
            this.writeByte((val.high << 4 | val.low) & 127 | 128);
            this.writeInt(val.high >>> 3);
         }
      }
   }
   /* 
   
   public readVarLong() : number
   {
      return this.readInt64(this._data).toNumber();
   }
   
   public readVarUhLong() : number
   {
      return this.readUInt64(this._data).toNumber();
   }
   public readBytes(bytes:ByteArray, offset:number = 0, length:number = 0) : void
   {
      this._data.readBytes(bytes,offset,length);
   }
   
 
   
   
   
   public readUnsignedByte() : number
   {
      return this._data.readUnsignedByte();
   }
   
   public readShort() : number
   {
      return this._data.readShort();
   }
   
   public readUnsignedShort() : number
   {
      return this._data.readUnsignedShort();
   }
   
   public readInt() : number
   {
      return this._data.readInt();
   }
   
   public readUnsignedInt() : number
   {
      return this._data.readUnsignedInt();
   }
   
   public readFloat() : number
   {
      return this._data.readFloat();
   }
   
  
   
   public readMultiByte(length:number, charSet:string) : string
   {
      return this._data.readMultiByte(length,charSet);
   }
 
   
   public readUTFBytes(length:number) : string
   {
      return this._data.readUTFBytes(length);
   }
   
   public get bytesAvailable() : number
   {
      return this._data.bytesAvailable;
   }
   
   public readObject() : any
   {
      return this._data.readObject();
   }
   
   public get objectEncoding() : number
   {
      return this._data.objectEncoding;
   }
   
   public set objectEncoding(version:number)
   {
      this._data.objectEncoding = version;
   }
   
   public get endian() : string
   {
      return this._data.endian;
   }
   
   public set endian(type:string)
   {
      this._data.endian = type;
   }
   
   public writeVarInt(value:number) : void
   {
      var b:any = 0;
      var ba:ByteArray = new ByteArray();
      if(value >= 0 && value <= CustomDataWrapper.MASK_01111111)
      {
         ba.writeByte(value);
         this._data.writeBytes(ba);
         return;
      }
      var c:number = value;
      for(var buffer:ByteArray = new ByteArray(); c != 0; )
      {
         buffer.writeByte(c & CustomDataWrapper.MASK_01111111);
         buffer.position = buffer.length - 1;
         b = int(buffer.readByte());
         c = c >>> CustomDataWrapper.CHUNCK_BIT_SIZE;
         if(c > 0)
         {
            b = b | CustomDataWrapper.MASK_10000000;
         }
         ba.writeByte(b);
      }
      this._data.writeBytes(ba);
   }
   
   public writeVarShort(value:number) : void
   {
      var b:any = 0;
      if(value > CustomDataWrapper.SHORT_MAX_VALUE || value < CustomDataWrapper.SHORT_MIN_VALUE)
      {
         throw new Error("Forbidden value");
      }
      var ba:ByteArray = new ByteArray();
      if(value >= 0 && value <= CustomDataWrapper.MASK_01111111)
      {
         ba.writeByte(value);
         this._data.writeBytes(ba);
         return;
      }
      var c:any = value & 65535;
      for(var buffer:ByteArray = new ByteArray(); c != 0; )
      {
         buffer.writeByte(c & CustomDataWrapper.MASK_01111111);
         buffer.position = buffer.length - 1;
         b = int(buffer.readByte());
         c = int(c >>> CustomDataWrapper.CHUNCK_BIT_SIZE);
         if(c > 0)
         {
            b = b | CustomDataWrapper.MASK_10000000;
         }
         ba.writeByte(b);
      }
      this._data.writeBytes(ba);
   }
   
   public writeVarLong(value:number) : void
   {
      var i:number = 0;
      var val:Int64 = Int64.fromNumber(value);
      if(val.high == 0)
      {
         this.writeint32(this._data,val.low);
      }
      else
      {
         for(i = 0; i < 4; )
         {
            this._data.writeByte(val.low & 127 | 128);
            val.low = val.low >>> 7;
            i++;
         }
         if((val.high & 268435455 << 3) == 0)
         {
            this._data.writeByte(val.high << 4 | val.low);
         }
         else
         {
            this._data.writeByte((val.high << 4 | val.low) & 127 | 128);
            this.writeint32(this._data,val.high >>> 3);
         }
      }
   }
   
   public writeBytes(bytes:ByteArray, offset:number = 0, length:number = 0) : void
   {
      this._data.writeBytes(bytes,offset,length);
   }
   
   public writeBoolean(value:boolean) : void
   {
      this._data.writeBoolean(value);
   }
   
   public writeByte(value:number) : void
   {
      this._data.writeByte(value);
   }
   
   public writeShort(value:number) : void
   {
      this._data.writeShort(value);
   }
   
   public writeInt(value:number) : void
   {
      this._data.writeInt(value);
   }
   
   public writeUnsignedInt(value:number) : void
   {
      this._data.writeUnsignedInt(value);
   }
   
   public writeFloat(value:number) : void
   {
      this._data.writeFloat(value);
   }
   
   public writeDouble(value:number) : void
   {
      this._data.writeDouble(value);
   }
   
   public writeMultiByte(value:string, charSet:string) : void
   {
      this._data.writeMultiByte(value,charSet);
   }
   
   public writeUTF(value:string) : void
   {
      this._data.writeUTF(value);
   }
   
   public writeUTFBytes(value:string) : void
   {
      this._data.writeUTFBytes(value);
   }
   
   public writeObject(object:any) : void
   {
      this._data.writeObject(object);
   }
   
   
   
   private readUInt64(input:IDataInput) : UInt64
   {
      var b:number = 0;
      var result:UInt64 = new UInt64();
      var i:number = 0;
      while(true)
      {
         b = input.readUnsignedByte();
         if(i == 28)
         {
            break;
         }
         if(b >= 128)
         {
            result.low = result.low | (b & 127) << i;
            i = i + 7;
            continue;
         }
         result.low = result.low | b << i;
         return result;
      }
      if(b >= 128)
      {
         b = b & 127;
         result.low = result.low | b << i;
         result.high = b >>> 4;
         i = 3;
         while(true)
         {
            b = input.readUnsignedByte();
            if(i < 32)
            {
               if(b >= 128)
               {
                  result.high = result.high | (b & 127) << i;
               }
               else
               {
                  break;
               }
            }
            i = i + 7;
         }
         result.high = result.high | b << i;
         return result;
      }
      result.low = result.low | b << i;
      result.high = b >>> 4;
      return result;
   }
   
   private writeint32(output:IDataOutput, value:number) : void
   {
      while(value >= 128)
      {
         output.writeByte(value & 127 | 128);
         value = value >>> 7;
      }
      output.writeByte(value);
   }
}*/
}
