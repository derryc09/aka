import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireObject, AngularFireList, AngularFireAction } from '@angular/fire/database';
import { Observable, Subject, Subscription, BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FormBuilder } from '@angular/forms';

import _ from 'lodash';

type Item = string;
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  private companiesRef: AngularFireList<any>;
  public model: any;
  public companies: [String];
  public aliases: [String];


  result$: Observable<AngularFireAction<firebase.database.DataSnapshot>[]>;
  name$: BehaviorSubject<string | null>;

  constructor(db: AngularFireDatabase) {
    this.companiesRef = db.list('companies');
    this.companiesRef.valueChanges().forEach((item) => {
      this.companies = _.map(item, 'name');
      this.name$ = new BehaviorSubject(null);
      this.result$ = this.name$.pipe(
        switchMap(name =>
          db.list('/companies', ref =>
            name ? ref.orderByChild('nameLowerCase').equalTo(name.toLowerCase()) : ref
          ).snapshotChanges()
        )
      );
    })
  }

  ngOnInit() {
    console.log("Search")
  }
  formatter = (state: Item) => state;

  filter = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter(term => term.length >= 2),
      map(term => term.length < 2 ? []
        : this.companies.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )


  search() {
    if (this.model) {
      this.name$.next(this.model);
    }
  }

}
