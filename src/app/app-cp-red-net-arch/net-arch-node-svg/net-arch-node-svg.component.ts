import { faFile, faLock, faCogs, faSkullCrossbones } from '@fortawesome/free-solid-svg-icons';
import { CPRedIconTypeSettings, NetArchNode } from './../models/net-arch-node';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { CPRedNetArchNode } from '../models/net-arch-node';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'cs-net-arch-node-svg',
  templateUrl: './net-arch-node-svg.component.svg',
  styleUrls: ['./net-arch-node-svg.component.css']
})
export class NetArchNodeSvgComponent implements OnInit {
  faFile = faFile;
  faLock = faLock;
  faCogs = faCogs;
  faSkullCrossbones = faSkullCrossbones;

  modalRef: BsModalRef;
  config = {
    keyboard: true,
    class: 'modal-dialog-centered modal-lg'
  };


  @Input()
  node: CPRedNetArchNode = new CPRedNetArchNode();

  @Input()
  iconColors: CPRedIconTypeSettings;

  @Input()
  defaultDV: number;

  private ids = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  @Output()
  updateNode: EventEmitter<CPRedNetArchNode> = new EventEmitter<CPRedNetArchNode>();

  iconOffset = 60;
  selectedId = '';

  getOffset(num: number):number {
    return this.iconOffset + ( num * this.iconOffset);
  }

  getName(name: string): string {
    if (name.length < 21 ) {
      return name;
    }
    return name.substring(0,18) + '...';
  }

  getColor(node: CPRedNetArchNode): string {
    if (node.color !== '') {
      return node.color;
    }
    switch(node.type) {
      case 'file':
        return this.iconColors.file.color;
      case 'password':
        return this.iconColors.password.color;
      case 'program':
        return this.iconColors.program.color;
      case 'controller':
        return this.iconColors.controlNode.color;
      default:
        return 'black';
    }
  }

  getBGColor(node: CPRedNetArchNode): string {
    if (node.bgColor !== '') {
      return node.bgColor;
    }
    switch(node.type) {
      case 'file':
        return this.iconColors.file.bgColor;
      case 'password':
        return this.iconColors.password.bgColor;
      case 'program':
        return this.iconColors.program.bgColor;
      case 'controller':
        return this.iconColors.controlNode.bgColor;
      default:
        return 'white';
    }
  }
  get diagramHeight(): number {
    return (this.node.numberOfBranches * 75) + 130;
  }

  get diagramWidth(): number {
    return (this.node.numberOfLevels * this.iconOffset) + this.iconOffset + 50;
  }

  get canAdd(): boolean {
    return this.node.numberOfFloors < 18;
  }

  showAdd(level: number): boolean {
    return level > 2 && this.canAdd;
  }

  constructor(private modalService: BsModalService) {}

  ngOnInit(): void {

  }

  getIcon(type: string): any {
    switch (type) {
      case 'file':
        return this.faFile.icon[4];
      case 'controller':
        return this.faCogs.icon[4];
      case 'program':
        return this.faSkullCrossbones.icon[4];
    }
    return this.faLock.icon[4];
  }

  addNewNode(id: string) {
    if (!this.canAdd) {
      return;
    }
    const newNode = new CPRedNetArchNode();
    let idIndex = this.node.numberOfFloors;
    let newId = this.ids[idIndex];
    while (this.node.hasChild(newId) && idIndex < this.ids.length) {
      idIndex++;
      newId = this.ids[idIndex];
    }

    newNode.id = newId;
    newNode.name = newNode.type;
    newNode.dv = this.defaultDV;
    switch(newNode.dv){
      case 6:
        newNode.cost = 500;
        break;
      case 8:
        newNode.cost = 1000;
        break;
      case 10:
        newNode.cost = 5000;
        break;
      case 12:
        newNode.cost = 10000;
        break;
      default:
        newNode.cost = 500;
        break;
    }

    this.node.insertChild(id, newNode);
    this.updateNode.emit(this.node);
  }

  removeNode(id: string, level: number) {
    if( level > 3) {
      this.node.deleteChild(id);
      this.updateNode.emit(this.node);
    }
  }

}
