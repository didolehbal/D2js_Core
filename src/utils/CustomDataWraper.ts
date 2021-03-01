//import ByteArray  from "bytearray-node"
//const bytearray : any = require("bytearray-node")
import Long from "long"

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
         case "Byte":
            return this.readByte()
         case "UnsignedShort":
            return this.readUnsignedShort()
         case "Short":
            return this.readShort()
         case "Int":
            return this.readInt()
         case "Boolean":
            return this.readBoolean()
         case "UTF":
            return this.readUTF()
         case "Double":
            return this.readDouble()
         case "VarUhLong":
            return this.readVarLong();
         case "VarLong":
            return this.readVarLong()
         case "VarUhInt":
         case "VarInt":
            return this.readVarInt()
         case "VarShort":
         case "VarUhShort":
            return this.readVarUhShort()

         default:
            throw new Error(`${type} not implemented`)
      }
   }


   public write(type: string, value: any) {

      switch (type) {
         case "UnsignedShort":
            return this.writeUnsignedShort(value)
         case "Short":
            return this.writeShort(value)
         case "VarUhLong":
         case "VarLong":
            return this.writeVarLong2(value)
         case "VarUhInt":
         case "VarInt":
            return this.writeVarInt(value)
         case "Boolean":
            return this.writeBoolean(value)
         case "UTF":
            return this.writeUTF(value)
         case "VarShort":
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
    readVarLong() {
      var result:Long = new Long(0,0,true);
      var shift = 0;
      var cursor = this.position;
    
      while(true) {
        if(cursor + 1 > this._data.length)
          console.log("error cursor + 1 > this._data.length")
        var b = this.readUnsignedByte();
    
        result = result.or((b & 0x7f) * Math.pow(2, shift)); // 53-bit safe
        //result |= ((b & 0x7f) << shift); // Add the bits to our number, except MSB
        cursor++;
        if(!(b & 0x80)) { // If the MSB is not set, we return the number
          return result.toNumber()
        }
        shift += 7; // we only have 7 bits, MSB being the return-trigger
        //console.log("error")
        // TODO: fix overflow when >53-bit
        //assert.ok(shift < 64, "varint is too big"); // Make sure our shift don't overflow.
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


   public writeUnsignedShort(value: number): void{
      let buff = Buffer.alloc(2)
      buff.writeUInt16BE(value)
      this._data = Buffer.concat([this._data, buff])
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

   public writeVarLong2(val:number) {
      var cursor = 0;
      let value = val;
     // assert.ok(value >= -9223372036854775808 && value <= 9223372036854775807, "value is out of range for 64-bit varint"); // XXX: these numbers are actually unrepresentable in JS
      while(value & 0x0fffffffffffff80) {
        //buffer.writeUInt8(bitwise64.or(value & 0xFF), 0x80), offset + cursor);
        this.writeByte((value & 0xFF)|0x80)
        cursor++;
        //value >>>= 7;
        value /= Math.pow(2, 7);
        value = Math.floor(value); // TODO: correct direction?
      }
      //buffer.writeUInt8(value, offset + cursor);
      this.writeByte(value)
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
   public writeInt32(value: number): void {
      while (value >= 128) {
         this.writeByte(value & 127 | 128);
         value = value >>> 7;
      }
      this.writeByte(value);
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



   public readUnsignedByte(): number {
      let b = this._data.readUIntBE(this.position, 1)
      this.position++
      return b
   }

   private readInt64(): number {
      var b: number = 0;
      var result = Long.fromInt(0)
      var i: number = 0;
      while (true) {
         b = this.readUnsignedByte();
         if (i == 28) {
            break;
         }
         if (b >= 128) {
            result.low = result.low | (b & 127) << i;
            i = i + 7;
            continue;
         }
         result.low = result.low | b << i;

         return result.toNumber()
      }
      if (b >= 128) {
         b = b & 127;
         result.low = result.low | b << i;
         result.high = b >>> 4;
         i = 3;
         while (true) {
            b = this.readUnsignedByte();
            if (i < 32) {
               if (b >= 128) {
                  result.high = result.high | (b & 127) << i;
               }
               else {
                  break;
               }
            }
            i = i + 7;
         }
         result.high = result.high | b << i;

         return result.toNumber()
      }
      result.low = result.low | b << i;
      result.high = b >>> 4;

      return result.toNumber()
   }

   public writeVarLong(value: number): void {
      //TODO: varlong not working
      var i: number = 0;
      
      var low = value & Number.parseInt("0000FFFF", 16)
      var high = value & Number.parseInt("FFFF0000", 16)

      if (high  == 0) {
         this.writeInt32(low);
      }
      else {
         for (i = 0; i < 4;) {
            this.writeByte(low & 127 | 128);
            low = low >>> 7;
            i++;
         }
         if ( (high & 268435455 >> 3) == 0) {
            this.writeByte(high << 4 | low);
         }
         else {
            this.writeByte((high << 4 | low) & 127 | 128);
            this.writeInt32(high  >>> 3);
         }
      }
   }

   public readUnsignedInt(): number {
      let b = this._data.readUInt32BE(this.position)
      this.position += 4
      return b
   }

   public readFloat(): number {
      let b = this._data.readFloatBE(this.position);
      this.position += 4
      return b
   }

   public writeUnsignedInt(value: number) {
      let buff = Buffer.alloc(4)
      buff.writeUInt32BE(value, 0)
      this._data = Buffer.concat([this._data, buff])
   }

   private readUInt64() {
      var b: number = 0;
      var result = Long.fromInt(0,true)
      var i: number = 0;
      while (true) {
         b = this.readUnsignedByte();
         if (i == 28) {
            break;
         }
         if (b >= 128) {
            result.low = result.low | (b & 127) << i;
            i = i + 7;
            continue;
         }
         result.low = result.low | b << i;

         return result.toNumber()
      }
      if (b >= 128) {
         b = b & 127;
         result.low = result.low | b << i;
         result.high = b >>> 4;
         i = 3;
         while (true) {
            b = this.readUnsignedByte();
            if (i < 32) {
               if (b >= 128) {
                  result.high = result.high | (b & 127) << i;
               }
               else {
                  break;
               }
            }
            i = i + 7;
         }
         result.high = result.high | b << i;

         return result.toNumber()
      }
      result.low = result.low | b << i;
      result.high = b >>> 4;

      return result.toNumber()
   }
   
}
