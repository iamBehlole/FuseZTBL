export class CircleModel {
	circle_id: number;
	circle_name: string;
	region_id: number;

	clear() {
		this.circle_id = 0;
		this.circle_name = '';
		this.region_id = 0;
	}
}
