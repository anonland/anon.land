import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-reports-preview',
  templateUrl: './reports-preview.component.html',
  styleUrls: ['./reports-preview.component.scss'],
})
export class ReportsPreviewComponent implements OnInit {

  reports: any[];

  constructor(
    private reportServ: ReportService,
    private router: Router,
    private popoverCtrl: PopoverController
  ) { }

  async ngOnInit() {
    this.reports = new Array();

    const postReports = await this.reportServ.getPostsReports();
    postReports.forEach((post) => {
      const reportObj: any = post.data();
      reportObj.id = post.id;
      reportObj.type = 'post';

      this.reports.push(reportObj);
    });

    const commentReports = await this.reportServ.getCommentsReports();
    commentReports.forEach((comment) => {
      const reportObj: any = comment.data();
      reportObj.id = comment.id;
      reportObj.type = 'comment';

      this.reports.push(reportObj);
    });
  }

  async goToPost(category, id) {
    await this.popoverCtrl.dismiss();
    await this.router.navigate([`${category}/${id}`]);
  }
}
