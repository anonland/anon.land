import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  public category: string;
  public posts = [{
    title: 'Codubi cerro voxed jijode'
  },{
    title: 'Codubi cerro voxed jijode'
  },{
    title: 'Codubi cerro voxed jijode'
  },{
    title: 'Codubi cerro voxed jijode'
  },{
    title: 'Codubi cerro voxed jijode'
  },{
    title: 'Codubi cerro voxed jijode'
  },{
    title: 'Codubi cerro voxed jijode'
  },{
    title: 'Codubi cerro voxed jijode'
  },{
    title: 'Codubi cerro voxed jijode'
  },{
    title: 'Codubi cerro voxed jijode'
  },{
    title: 'Codubi cerro voxed jijode'
  },{
    title: 'Codubi cerro voxed jijode'
  },{
    title: 'Codubi cerro voxed jijode'
  },{
    title: 'Codubi cerro voxed jijode'
  },{
    title: 'Codubi cerro voxed jijode'
  },{
    title: 'Codubi cerro voxed jijode'
  },{
    title: 'Codubi cerro voxed jijode'
  },{
    title: 'Codubi cerro voxed jijode'
  },{
    title: 'Codubi cerro voxed jijode'
  },{
    title: 'Codubi cerro voxed jijode'
  },
]

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.category = this.activatedRoute.snapshot.paramMap.get('id');
  }

}
