export class FaultDetailModel {
	f_id: number;
	f_name: string;
	ftype_id: number;

	clear() {
		this.f_id = 0;
		this.f_name = '';
		this.ftype_id = 0;
	}
}
