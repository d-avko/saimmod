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
    let result = "Результаты: <br/>";
    let meanSystem = 0;
    let A = 0;
    console.log(smo.stats);
    console.log(smo.stats.length);
	let An2 = 0;
	let An3 = 0;
    for (let key in smo.stats) {
        if (smo.stats[key] !== 1) {
            result += `P${key} = ${smo.stats[key] / numberOfSteps}<br/>`;
            meanSystem += smo.stats[key] / numberOfSteps * (Number(key[1]) + Number(key[2]) + Number(key[3]));																					
            if ((key[3] == 1 && key[2] == 1)) {
                An3 += smo.stats[key] / numberOfSteps;
				An2 += smo.stats[key] / numberOfSteps;																			
            }else if ((key[2] == 1)){
				An2 += smo.stats[key] / numberOfSteps;	
			}else if(key[3] == 1){
				An3 += smo.stats[key] / numberOfSteps;					
			}
        }
    }
    An2 *= (1 - pi2);
	An3 *= (1 - pi3);
	A = An2 + An3;
    let pBlock = smo.blocked / numberOfSteps;
    let lambda = 0.5 * (1 - pBlock);
    let pRej = smo.rejected / numberOfSteps;
    let Q = A / lambda;
    let meanTimeC1 = 1 / (1 - pi1);
    let meanTimeC2 = 1 / (1 - pi2);
    let meanTimeC3 = 1 / (1 - pi3);
    let meanTimeInSystem = meanTimeC1 + meanTimeC2 + meanTimeC3;
    result += `Вероятность отказа: ${pRej}<br/>`;
    result += `Вероятность блокировки: ${pBlock}<br/>`;
    result += `Среднее количество заявок в системе: ${meanSystem}<br/>`;
    result += `Относительная пропускная способность: ${Q}<br/>`;
    result += `Абсолютная пропускная способность: ${A}<br/>`;
    result += `Среднее время заявок в системе: ${meanTimeInSystem}<br/>`;
    document.getElementById("result").innerHTML = result;
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
        this.source = 0;
        this.rejected = 0;
        this.blocked = 0;
        this.stats = {};
        this.saveStats();
        this.generator = lemenGenerator();
    }

    processNextStep() {
        if(this.channel3 && (1 - this.pi3 > this.generator.next().value)){
            this.channel3 = 0;
        }

        if(this.channel2 &&  (1 - this.pi2 > this.generator.next().value)){
            this.channel2 = 0;
        }

        if(this.channel1 && (1 - this.pi1 > this.generator.next().value)){
            if(this.channel2 && this.channel3){
                this.channel1 = 0;
                this.rejected++;
            }else if(!this.channel2){
                this.channel1 = 0;
                this.channel2 = 1;
            }else if (!this.channel3){
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
                }
            }else{
                
            }
        }else if(!this.source){
            if(!this.channel1){
                this.source = 1;
                this.channel1 = 1;  
            }else{
                this.blocked++;
            }
        }

        // if((1 - this.p > this.generator.next().value) && this.source && !this.channel1){
        //     this.source = 1;
        //     this.channel1 = 1;
        // }

        // if((1 - this.p > this.generator.next().value) && this.source && this.channel1){
        //     this.source = 0;
        //     this.blocked++;
        // }

        //01 - 01

        

        this.saveStats();
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