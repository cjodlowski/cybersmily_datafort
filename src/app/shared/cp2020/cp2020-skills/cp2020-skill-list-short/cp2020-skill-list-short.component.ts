import { Cp2020SkillUpdate } from './../models/cp2020-skill-update';
import { faDice } from '@fortawesome/free-solid-svg-icons';
import { Cp2020PlayerSkill, Cp2020PlayerSkills } from './../models';
import { Cp2020PlayerRole } from '../../cp2020-role/models/cp2020-player-role';
import { Cp2020StatBlock } from '../../cp2020-stats/models/cp2020-stat-block';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cs-cp2020-skill-list-short',
  templateUrl: './cp2020-skill-list-short.component.html',
  styleUrls: ['./cp2020-skill-list-short.component.css'],
})
export class Cp2020SkillListShortComponent implements OnInit {
  faDice = faDice;

  @Input()
  role = new Cp2020PlayerRole();

  @Input()
  stats = new Cp2020StatBlock();

  @Input()
  skills = new Cp2020PlayerSkills();

  @Output()
  changeSpecialAblity = new EventEmitter<Cp2020PlayerRole>();

  @Output()
  changeSKills = new EventEmitter<Cp2020PlayerSkills>();

  skillTotals = { role: {}, other: {} };

  showAll: boolean = false;

  SkillList: Cp2020PlayerSkills = new Cp2020PlayerSkills();

  constructor() {}

  ngOnInit() {}

  onChangeSkill(skillUpdate?: Cp2020SkillUpdate) {
    if (skillUpdate) {
      this.skills.editSkill(skillUpdate);
    }
    this.changeSKills.emit(this.skills);
  }

  onChangeSpecialAbility() {
    this.changeSpecialAblity.emit(this.role);
  }

  getColumnOne(skills: Array<Cp2020PlayerSkill>): Array<Cp2020PlayerSkill> {
    const multi = skills.length % 3 === 0 ? 0.33 : 0.34;
    return skills.slice(0, Math.ceil(skills.length * multi));
  }

  getColumnTwo(skills: Array<Cp2020PlayerSkill>): Array<Cp2020PlayerSkill> {
    const multi = skills.length % 3 === 0 ? 0.33 : 0.34;
    const start = Math.ceil(skills.length * multi);
    const end = Math.ceil(skills.length * 0.33);
    return skills.slice(start, start + end);
  }

  getColumnThree(skills: Array<Cp2020PlayerSkill>): Array<Cp2020PlayerSkill> {
    const multi = skills.length % 3 === 0 ? 0.66 : 0.67;
    return skills.slice(Math.ceil(skills.length * multi));
  }
}
