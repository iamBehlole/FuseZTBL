export class DeviceStatusModel {
	statusID: number;
	statusName: string;

	clear() {
		this.statusID = 0;
		this.statusName = '';
	}
}
