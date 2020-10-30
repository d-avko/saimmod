document.getElementById("ok").addEventListener("click", (ev => {
    let pi1 = Number(document.getElementById("pi1").value);
    let pi2 = Number(document.getElementById("pi2").value);
    let pi3 = Number(document.getElementById("pi3").value);
    let p = Number(document.getElementById("p").value);
    const numberOfSteps = 100000;
    let smo = new SMO(pi1, pi2, pi3, p);

    for (let i = 0; i < numberOfSteps; i++) {
        smo.processNextStep();
    }
    smo.endProcessing();
    let result = "Результаты: <br/>";
    let meanSystem = 0;
    let A = 0;
    console.log(smo.stats);
    console.log(smo.stats.length);
	let An2 = 0;
    let An3 = 0;
    let kCh1 = 0;
    let kCh2 = 0;
    let kCh3 = 0;
    let Pbz = 0;
    let P2 = 0;
    let P3 = 0;
    let arr2 = [];
    let arr3 = [];
    let arrbz = [];
    let x1 = 0;
    let y1 = 0;
    for (let key in smo.stats) {
        if (smo.stats[key] !== 1) {
            result += `P${key} = ${smo.stats[key] / numberOfSteps}<br/>`;
            meanSystem += smo.stats[key] / numberOfSteps * (Number(key[1]) + Number(key[2]) + Number(key[3]));																					
            if ((key[3] == 1 && key[2] == 1)) {
                An3 += smo.stats[key] / numberOfSteps;
                An2 += smo.stats[key] / numberOfSteps;
                kCh2 += smo.stats[key] / numberOfSteps;
                kCh3 += smo.stats[key] / numberOfSteps;																		
            }else if ((key[2] == 1)){
                An2 += smo.stats[key] / numberOfSteps;	
                kCh2 += smo.stats[key] / numberOfSteps
			}else if(key[3] == 1){
                An3 += smo.stats[key] / numberOfSteps;	
                kCh3 += smo.stats[key] / numberOfSteps;		
            }
            
            if(key[1] == 1){
                kCh1 += smo.stats[key] / numberOfSteps;
            }

            if(key[1] == 1 && (key[2] == 0 || key[3] == 0)){
                Pbz += smo.stats[key] / numberOfSteps;
                arrbz.push(key)
            }

            if(key[2] == 0 && key[1] == 1){
                P2 += smo.stats[key] / numberOfSteps;
                arr2.push(key)
            }

            if(key[2] != 0 && key[3] == 0 && key[1] == 1){
                P3 += smo.stats[key] / numberOfSteps;
                arr3.push(key)
            }

            if(key[2] == 1 && key[3] == 1 && key[1] == 1){
                x1 += smo.stats[key] / numberOfSteps;
            }

            if(key[1] == 1){
                y1 += smo.stats[key] / numberOfSteps;
            }
        }
    }
    An2 *= (1 - pi2);
	An3 *= (1 - pi3);
    A = An2 + An3;
    console.log(arr2);
    console.log(arr3);
    console.log(arrbz);
    console.log(`Potk ${pi2*pi3*(x1 / y1)}`)
    let pBlock = smo.blocked / numberOfSteps;
    let pRej = smo.rejected / smo.timeInSystemRes.length;

    let Wc = smo.timeInSystemRes.reduce((prev, curr, index) => {
        if(prev == undefined || prev.time == undefined || curr == undefined || curr.time == undefined){
            console.log(index);
        }

        return {time: curr.time + prev.time};
    }, {time: 0}).time / smo.timeInSystemRes.length;

    let pi2Part = 1 / (1 - pi2);
    pi2Part *= An2 / (An2 + An3);

    let pi3Part = 1 / (1 - pi3);
    pi3Part *= An3 / (An2 + An3);

    Wc = (1 / (1 - pi1)) +  checkIfNan(pi2Part, 0) + checkIfNan(pi3Part, 0);

    let x = smo.timeInSystemRes.sort((a,b) => a.time - b.time);

    console.log(x[smo.timeInSystemRes.length / 2])

    let q = (smo.timeInSystemRes.length - smo.timeInSystem.length - smo.rejected) / (smo.timeInSystemRes.length);

    if(smo.timeInSystemRes.length == 0 && smo.timeInSystem.length == 0){
        q = 0;
    }   

    function checkIfNan(val, ret){
        if(isNaN(val) || !isFinite(val)){
            return ret;
        }

        return val;
    }

    result += `Вероятность отказа: ${pRej}<br/>`;
    result += `Вероятность блокировки: ${pBlock}<br/>`;
    result += `Среднее количество заявок в системе: ${meanSystem}<br/>`;
    result += `Относительная пропускная способность: ${q}<br/>`;
    result += `Абсолютная пропускная способность: ${A}<br/>`;
    result += `Среднее время заявок в системе: ${Wc}<br/>`;
    result += `Kch1: ${kCh1}<br/>`;
    result += `Kch2: ${kCh2}<br/>`;
    result += `Kch3: ${kCh3}<br/>`;
    document.getElementById("result").innerHTML = result;
    console.log(smo);
}));

function* lemenGenerator() {
    const m = 2 ** 32;
    const a = 1664525;
    const c = 1013904223;
    let R = 1;
    while (true) {
        R = (a * R + c) % m;
        yield R / m;
    }
}

class Stat {
    source;
    channel1;
    channel2;
    channel3;

    constructor(source, channel1, channel2, channel3) {
        this.source = source;
        this.channel1 = channel1;
        this.channel2 = channel2;
        this.channel3 = channel3;
    }

    toString() {
        return `${this.source}${this.channel1}${this.channel2}${this.channel3}`;
    }
}

class SMO {
    constructor(pi1, pi2, pi3, p) {
        this.pi1 = pi1;
        this.pi2 = pi2;
		this.pi3 = pi3;
		this.p = p;
        this.channel1 = 0;
        this.channel2 = 0;
		this.channel3 = 0;
        this.source = 1;
        this.rejected = 0;
        this.blocked = 0;
        this.stats = {};
        this.timeInSystem = [];
        this.timeInSystemRes = [];
        this.saveStats();
        this.generator = lemenGenerator();
    }

    processNextStep() {
        if(this.channel3 && (1 - this.pi3 > this.generator.next().value)){
            let searchArray = this.timeInSystem.map(x => x.cameTo);
            let idx = searchArray.lastIndexOf('n3');

            this.channel3 = 0;
            this.timeInSystemRes.push(this.timeInSystem.splice(idx,1)[0]);
        }

        if(this.channel2 &&  (1 - this.pi2 > this.generator.next().value)){
            let searchArray = this.timeInSystem.map(x => x.cameTo);
            let idx = searchArray.lastIndexOf('n2');

            this.channel2 = 0;
            this.timeInSystemRes.push(this.timeInSystem.splice(idx,1)[0]);
        }

        if(this.channel1 && (1 - this.pi1 > this.generator.next().value)){
            if(this.channel2 && this.channel3){
                this.channel1 = 0;

                let searchArray = this.timeInSystem.map(x => x.cameTo);
                let idx = searchArray.lastIndexOf('n1');

                this.timeInSystemRes.push(this.timeInSystem.splice(idx, 1)[0]);
                this.rejected++;
            }else if(!this.channel2){
                let searchArray = this.timeInSystem.map(x => x.cameFrom);
                let idx = searchArray.lastIndexOf('s');
                this.timeInSystem[idx].cameFrom = 'n1';
                this.timeInSystem[idx].cameTo = 'n2';

                this.channel1 = 0;
                this.channel2 = 1;
            }else if (!this.channel3){
                let searchArray = this.timeInSystem.map(x => x.cameFrom);
                let idx = searchArray.lastIndexOf('s');
                this.timeInSystem[idx].cameFrom = 'n1';
                this.timeInSystem[idx].cameTo = 'n3';
                
                this.channel1 = 0;
                this.channel3 = 1;
            }
        }

        if(this.source){
            if((1 - this.p > this.generator.next().value)){
                if(this.channel1){
                    this.source = 0;
                    this.blocked++;
                }else{
                    this.channel1 = 1;
                    this.timeInSystem.push({time: 0, cameFrom: 's', cameTo: 'n1'});
                }
            }else{
                
            }
        }else if(!this.source){
            if(!this.channel1){
                this.source = 1;
                this.channel1 = 1;  
                this.timeInSystem.push({time: 0, cameFrom: 's', cameTo: 'n1'});
            }else{
                this.blocked++;
            }
        }

        for(let i = 0; i < this.timeInSystem.length; ++i){
            this.timeInSystem[i].time++;
        }

        this.saveStats();
    }

    endProcessing(){
        this.timeInSystemRes = this.timeInSystem.concat(this.timeInSystemRes);
    }

    saveStats() {
        let stat = new Stat(this.source, this.channel1, this.channel2, this.channel3);
        if (!this.stats[stat]) {
            this.stats[stat] = 1;
        } else {
            this.stats[stat]++;
        }
    }
}