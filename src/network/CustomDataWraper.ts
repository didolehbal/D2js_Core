export class CustomDataWrapper {

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

   private position: number = 0;

   constructor(data: Buffer, position: number = 0) {
      this._data = data
      this.position = position;
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
      this.position++;
      return b
   }

   public readUTF(): string {
      let res = ""
      for (let i = 0; i < 4; i++) {
         let b = this._data.readIntBE(this.position, 1);
         this.position++;
         res += b.toString()
      }
      return res
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
   
   public readBoolean() : boolean
   {
      return this._data.readBoolean();
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
   
   private readInt64(input:IDataInput) : Int64
   {
      var b:number = 0;
      var result:Int64 = new Int64();
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
