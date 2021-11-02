import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Cp2020ProgramList } from '../models';
import { faTrash, faFilePdf, faSave, faUndo, faUpload, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, TemplateRef } from '@angular/core';
import { Cp2020Program } from '../models';

@Component({
  selector: 'cs-program-list',
  templateUrl: './cp2020-program-list.component.html',
  styleUrls: ['./cp2020-program-list.component.css']
})
export class Cp2020ProgramListComponent implements OnInit {
  faTrash = faTrash;
  faFilePdf = faFilePdf;
  faSave = faSave;
  faUndo = faUndo;
  faUpload = faUpload;
  faPlus = faPlus;
  modalRef: BsModalRef;
  config = {
    keyboard: true,
    class: 'modal-dialog-centered modal-lg'
  };

  program: Cp2020Program = new Cp2020Program();

  modalTitle = 'New';

  @Input()
  programList: Cp2020ProgramList = new Cp2020ProgramList();

  @Input()
  maxMu = 0;

  @Output()
  updateList: EventEmitter<Cp2020ProgramList> = new EventEmitter<Cp2020ProgramList>();

  constructor(private modalService: BsModalService) { }

  ngOnInit(): void {
  }

  delete(index: number) {
    this.programList.removeByIndex(index);
    this.updateList.emit(this.programList);
  }

  showSelect(index: number, template) {
    this.modalTitle = 'Selected';
    this.program = this.programList.getByIndex(index);
    this.modalRef = this.modalService.show(template, this.config);
  }

  showNew(template: TemplateRef<any>) {
    this.modalTitle = 'New';
    this.program = new Cp2020Program();
    this.modalRef = this.modalService.show(template, this.config);
  }

  load(index: number) {
    this.programList.setLoaded(index);
    this.updateList.emit(this.programList);
  }

  update(prog: Cp2020Program) {
    this.programList.updateProgram(prog);
    this.updateList.emit(this.programList);
  }
}
