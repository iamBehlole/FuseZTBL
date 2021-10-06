export class FaultTypeModel {
	ftype_id: number;
	f_type: string;

	clear() {
		this.ftype_id = 0;
		this.f_type = '0';
	}
}
