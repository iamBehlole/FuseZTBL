export class BulkDeviceDataUploadModel {
	typeId: number;
	file: string;
	deviceStatus?: number;

	clear() {
		this.typeId = 0;
		this.file = '';
		this.deviceStatus = null;
	}
}
