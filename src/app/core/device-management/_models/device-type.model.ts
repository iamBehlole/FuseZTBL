export class DeviceTypeModel {
	typeID: number;
	typeName: string;

	clear() {
		this.typeID = 0;
		this.typeName = '';
	}
}
