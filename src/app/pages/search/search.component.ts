import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireObject, AngularFireList, AngularFireAction } from '@angular/fire/database';
import { Observable, Subject, Subscription, BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FormBuilder } from '@angular/forms';
import _ from 'lodash';

const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
  'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
  'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
  'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
  'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];


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

  public items;

  constructor(db: AngularFireDatabase) {
    this.companiesRef = db.list('companies');
    this.companiesRef.valueChanges().forEach((item) => {
      this.companies = _.map(item, 'name');
      this.items = item;
      console.log(this.items);
      console.log(this.companies);
    })
  }


  ngOnInit() {
    console.log("Search")
  }

  filter = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.companies.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )


  search(e) {
    console.log(e);
    console.log("Searching....");
    console.log(e.target.value);
  }

}
