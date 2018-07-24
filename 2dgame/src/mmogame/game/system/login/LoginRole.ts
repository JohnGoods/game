class LoginRole extends TClass{
	id:number = 0;
	name:string = "";
	level:number = 0
	body:number = 0
	groupIndex:number = 0

	read(reader:BinaryStream){
		this.id = reader.readUnsignedInt();
		this.name = reader.readString();
		this.level = reader.readUnsignedInt();
		this.body = reader.readUnsignedInt();
		this.groupIndex = reader.readUShort();
	}
}