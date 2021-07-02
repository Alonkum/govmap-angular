import { Component, OnInit } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Observable, Subject } from 'rxjs';
import { GovmapService } from './services/govmap.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  showFiller = false;
  title = 'govmap-angular';
  layers!: Observable<any>;

  constructor(private govmap: GovmapService) {

  }

  ngOnInit() {
    this.layers = this.govmap.getLayers();
  }
}
