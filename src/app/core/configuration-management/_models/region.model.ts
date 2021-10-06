export class RegionModel {
	region_id: number;
	region_name: string;

	clear() {
		this.region_id = 0;
		this.region_name = '';
	}
}
