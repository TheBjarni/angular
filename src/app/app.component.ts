import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { allItems } from './common/items';
import { SortType } from './common/sortType';
import { SortDirection } from './common/sortDirection';
import { cloneList } from './common/utils';
import { ComboBoxComponent } from './components/combo-box/combo-box.component';
import { HttpClient } from '@angular/common/http';

interface Item {
  type: string;
  title: string;
  dateUploaded?: string|Date;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  readonly ALL_MEDIA = 'All';
  readonly filterComboItems: ComboItem[] = [
    { label: 'All items', value: 'All' },
    { label: 'Images', value: 'Image' },
    { label: 'Audios', value: 'Audio' },
    { label: 'Videos', value: 'Video' },
    { label: 'Documents', value: 'Document' },
  ];
  readonly sortByComboItems: ComboItem[] = [
    { label: 'Alphabetical', value: SortType.ALPHABETICAL },
    { label: 'Upload date', value: SortType.DATE_UPLOADED },
  ];

  @ViewChild('search', {static: true}) searchInput: ElementRef<HTMLInputElement>;
  @ViewChild('filterBy', {static: true}) filterByCombo: ComboBoxComponent;
  @ViewChild('sortBy', {static: true}) sortByCombo: ComboBoxComponent;
  fetchedItems: Item[] = [];
  searchedItems: Item[] = [];
  filteredItems: Item[] = [];
  itemsToShow: Item[] = [];
  sortBy = SortType.ALPHABETICAL;
  sortDirection = SortDirection.ASCENDING;
  waitingForData = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('https://www.mocky.io/v2/5df7a46f320000a0582e015c').subscribe(result => {
      this.fetchedItems = result as Item[];
      this.initData();
    }, (error) => {
      console.warn(error);
      this.fetchedItems = allItems;
      this.initData();
    });
  }

  onSearchChanged(event) {
    const {
      target: { value }
    } = event;
    if (!value) {
      this.searchedItems = cloneList(this.fetchedItems);
    } else {
      this.searchedItems = this.fetchedItems.filter(item => item.title.toUpperCase().includes(value.toUpperCase()));
    }
    this.refreshItems();
  }

  onFilterByChanged(event) {
    const {
      target: { value }
    } = event;
    if (value === this.ALL_MEDIA) {
      this.filteredItems = cloneList(this.fetchedItems);
    } else {
      this.filteredItems = this.fetchedItems.filter(item => item.type.toUpperCase().includes(value.toUpperCase()));
    }
    this.refreshItems();
  }

  onSortByChanged(event) {
    const {
      target: { value }
    } = event;
    this.sortBy = value;
    this.refreshItems();
  }

  clear() {
    this.resetInputs();
    this.resetVars();
    this.refreshItems();
  }

  refreshItems() {
    this.itemsToShow = this.searchedItems.filter(item => this.filteredItems.map(elem => elem.title).includes(item.title));
    const sortComparator: (a: Item, b: Item) => number = this.sortDirection === SortDirection.ASCENDING
      ? this.sortAscendingComparator
      : (a, b) => -1 * this.sortAscendingComparator(a, b);
    this.itemsToShow.sort(sortComparator);
  }

  private initData() {
    this.searchedItems = cloneList(this.fetchedItems);
    this.filteredItems = cloneList(this.fetchedItems);
    this.itemsToShow = cloneList(this.fetchedItems);
    this.waitingForData = false;
    this.refreshItems();
  }

  private resetInputs() {
    this.searchInput.nativeElement.value = '';
    this.sortDirection = SortDirection.ASCENDING;
    this.filterByCombo.reset();
    this.sortByCombo.reset();
  }

  private resetVars() {
    this.searchedItems = cloneList(this.fetchedItems);
    this.filteredItems = cloneList(this.fetchedItems);
    this.sortBy = SortType.ALPHABETICAL;
  }

  private sortAscendingComparator = (a: Item, b: Item): number => {
    if (this.sortBy === SortType.ALPHABETICAL) {
      return a.title.localeCompare(b.title);
    }
    if (a.dateUploaded == null) {
      return 1;
    }
    if (b.dateUploaded == null) {
      return -1;
    }
    return new Date(a.dateUploaded).getTime() - new Date(b.dateUploaded).getTime();
  }
}
