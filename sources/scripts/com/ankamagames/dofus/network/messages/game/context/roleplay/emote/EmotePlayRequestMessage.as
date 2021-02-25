package com.ankamagames.dofus.network.messages.game.context.roleplay.emote
{
   import com.ankamagames.jerakine.network.CustomDataWrapper;
   import com.ankamagames.jerakine.network.ICustomDataInput;
   import com.ankamagames.jerakine.network.ICustomDataOutput;
   import com.ankamagames.jerakine.network.INetworkMessage;
   import com.ankamagames.jerakine.network.NetworkMessage;
   import com.ankamagames.jerakine.network.utils.FuncTree;
   import flash.utils.ByteArray;
   
   public class EmotePlayRequestMessage extends NetworkMessage implements INetworkMessage
   {
      
      public static const protocolId:uint = 6265;
       
      
      private var _isInitialized:Boolean = false;
      
      public var emoteId:uint = 0;
      
      public function EmotePlayRequestMessage()
      {
         super();
      }
      
      override public function get isInitialized() : Boolean
      {
         return this._isInitialized;
      }
      
      override public function getMessageId() : uint
      {
         return 6265;
      }
      
      public function initEmotePlayRequestMessage(emoteId:uint = 0) : EmotePlayRequestMessage
      {
         this.emoteId = emoteId;
         this._isInitialized = true;
         return this;
      }
      
      override public function reset() : void
      {
         this.emoteId = 0;
         this._isInitialized = false;
      }
      
      override public function pack(output:ICustomDataOutput) : void
      {
         var data:ByteArray = new ByteArray();
         this.serialize(new CustomDataWrapper(data));
         writePacket(output,this.getMessageId(),data);
      }
      
      override public function unpack(input:ICustomDataInput, length:uint) : void
      {
         this.deserialize(input);
      }
      
      override public function unpackAsync(input:ICustomDataInput, length:uint) : FuncTree
      {
         var tree:FuncTree = new FuncTree();
         tree.setRoot(input);
         this.deserializeAsync(tree);
         return tree;
      }
      
      public function serialize(output:ICustomDataOutput) : void
      {
         this.serializeAs_EmotePlayRequestMessage(output);
      }
      
      public function serializeAs_EmotePlayRequestMessage(output:ICustomDataOutput) : void
      {
         if(this.emoteId < 0 || this.emoteId > 255)
         {
            throw new Error("Forbidden value (" + this.emoteId + ") on element emoteId.");
         }
         output.writeByte(this.emoteId);
      }
      
      public function deserialize(input:ICustomDataInput) : void
      {
         this.deserializeAs_EmotePlayRequestMessage(input);
      }
      
      public function deserializeAs_EmotePlayRequestMessage(input:ICustomDataInput) : void
      {
         this._emoteIdFunc(input);
      }
      
      public function deserializeAsync(tree:FuncTree) : void
      {
         this.deserializeAsyncAs_EmotePlayRequestMessage(tree);
      }
      
      public function deserializeAsyncAs_EmotePlayRequestMessage(tree:FuncTree) : void
      {
         tree.addChild(this._emoteIdFunc);
      }
      
      private function _emoteIdFunc(input:ICustomDataInput) : void
      {
         this.emoteId = input.readUnsignedByte();
         if(this.emoteId < 0 || this.emoteId > 255)
         {
            throw new Error("Forbidden value (" + this.emoteId + ") on element of EmotePlayRequestMessage.emoteId.");
         }
      }
   }
}