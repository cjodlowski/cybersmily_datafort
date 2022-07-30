import {
  faChevronDown,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cs-cp-red-role-display',
  templateUrl: './cp-red-role-display.component.html',
  styleUrls: ['./cp-red-role-display.component.css'],
})
export class CpRedRoleDisplayComponent implements OnInit {
  faChevronDown = faChevronDown;
  faChevronRight = faChevronRight;

  isCollapsed = false;

  constructor() {}

  ngOnInit(): void {}
}
