export class DeviceModel {
	device_id: number;
	serial_no: string;
	device_name: string;
	device_make: string;
	channel_id: number;
	retailer_id: string;
	parent_id: string;
	region_id: number;
	status_id: number;
	device_type_id: number;
	warrenty_status: string;

	clear() {
		this.device_id = 0;
		this.serial_no = '';
		this.device_name = '';
		this.device_make = '';
		this.channel_id = 0;
		this.retailer_id = '';
		this.parent_id = '';
		this.region_id = 0;
		this.status_id = 0;
		this.device_type_id = 0;
		this.warrenty_status = '';
	}
}
