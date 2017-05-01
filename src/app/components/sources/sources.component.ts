import {Component, Input, OnInit, OnChanges} from '@angular/core';
import {SourcesService} from '../../services/sources.service';
import {FirebaseListObservable} from 'angularfire2';

@Component({
  selector: 'app-sources',
  templateUrl: 'sources.component.html',
  styleUrls: ['sources.component.css'],
  providers: [SourcesService]
})
export class SourcesComponent implements OnInit, OnChanges {


  items: FirebaseListObservable<any[]>;
  af;
  @Input()
  sources: string;

  ngOnInit() {
    // console.log(this.sources);
    this.items = this.sourcesService.getSources(this.sources);
  }

  ngOnChanges(changes) {
    this.sources = changes.sources.currentValue;
    this.items = this.sourcesService.getSources(this.sources);
  }

  constructor(private sourcesService: SourcesService) {
  }
}
