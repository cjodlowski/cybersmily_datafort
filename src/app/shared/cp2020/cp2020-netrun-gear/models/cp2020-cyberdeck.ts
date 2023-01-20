import { Cp2020Program } from './cp2020-program';
import { SourceBook } from './../../../models/sourcebook';
import { CyberdeckChassis } from './cyberdeck-chassis';
import { Cyberdeck } from './cyberdeck';
import { CyberdeckOption } from './cyberdeck-option';
import { Program } from './program';

export class Cp2020Cyberdeck implements Cyberdeck {
  name: string;
  type: CyberdeckChassis;
  dataWall: number;
  speed: number;
  private _mu: number = 10;
  doubleMu: boolean;
  options: Array<CyberdeckOption>;
  programs: Array<Cp2020Program>;
  description: string;
  codeGate: number;
  source?: SourceBook;
  bookPrice: number;

  constructor(param?: any) {
    this.name = param?.name ?? '';
    this.type = param?.type ?? undefined;
    this.dataWall = param?.dataWall ?? 2;
    this.codeGate = param?.codeGate ?? 0;
    this.speed = param?.speed ?? 0;
    const mu = Number(param?._mu ?? param?.totalMU ?? 10);
    this._mu = isNaN(mu) ? 10 : mu;
    this.doubleMu = param?.doubleMu ?? false;
    this.options = param?.options ?? new Array<CyberdeckOption>();
    this.programs =  new Array<Cp2020Program>();
    if(Array.isArray(param?.programs)) {
      this.programs = param.programs.map(prog => new Cp2020Program(prog));
    }
    this.description = param?.description ?? '';
    this.source = param?.source ?? undefined;
    this.bookPrice = param?.bookPrice ?? 0;
  }

  get chassis(): string {
    return this.type.name;
  }

  get totalMU(): number {
    let mu = this._mu;
    mu += this.doubleMu ? 10 : 0;
    mu += this.options.reduce(
      (a, b) => a + (b.mods?.mu ?? 0) * (b.count ?? 1),
      0
    );
    return mu;
  }

  get mu(): number {
    return this._mu;
  }

  set mu(value: number) {
    this._mu = value > 0 ? value : 0;
  }

  get cost(): number {
    let basecost = 0;
    basecost = this.type ? this.type.cost : 0;
    basecost += (this.dataWall - 2) * 1000;
    basecost += this.speed > 0 ? this.speed * 2000 : 0;
    basecost += this.doubleMu ? 5000 : 0;
    let optcost = 0;
    this.options.forEach((o) => {
      if (isNaN(Number(o.cost)) && o.cost.toString().startsWith('*')) {
        let mod = 1;
        const value = Number(o.cost.toString().replace('*', ''));

        mod = isNaN(value) ? 0 : 0 + value;
        optcost += basecost * mod;
      } else {
        optcost += Number(o.cost) * (o.count ? o.count : 1);
      }
    });
    return basecost + optcost;
  }

  get usedMu(): number {
    return this.programs.reduce((a, b) => a + b.mu, 0);
  }

  get maxSpeed(): number {
    let spd = 5;
    spd += this.options.reduce(
      (a, b) =>
        a +
        (b.mods && b.mods['maxSpeed']
          ? b.mods['maxSpeed'] * (b.count ? b.count : 1)
          : 0),
      0
    );
    return spd;
  }

  updateOption(opt: CyberdeckOption) {
    if (opt.count && opt.count > 0) {
      if (!this.options.some((o: CyberdeckOption) => o.name === opt.name)) {
        this.options.push(opt);
      } else {
        const i = this.options.findIndex((o) => o.name === opt.name);
        this.options[i].count = opt.count;
      }
    } else {
      const i = this.options.findIndex((o) => o.name === opt.name);
      this.options.splice(i, 1);
    }
    this.options.sort((a, b) =>
      a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
    );
  }
}
