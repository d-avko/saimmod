
document.getElementById("ok1").addEventListener("click", (ev => {

    let smo = new SMO(0.4, 0.5, 0.8, 0.8);
    smo.calculate();
    console.log(smo);
}));

function* lemenGenerator() {
    yield 0;
    yield 0;
    yield 0;
    yield 0;

    yield 0;
    yield 0;
    yield 0;
    yield 1;

    yield 0;
    yield 0;
    yield 1;
    yield 0;

    yield 0;
    yield 0;
    yield 1;
    yield 1;

    yield 0;
    yield 1;
    yield 0;
    yield 0;

    yield 0;
    yield 1;
    yield 0;
    yield 1;

    yield 0;
    yield 1;
    yield 1;
    yield 0;

    yield 0;
    yield 1;
    yield 1;
    yield 1;

    yield 1;
    yield 0;
    yield 0;
    yield 0;

    yield 1;
    yield 0;
    yield 0;
    yield 1;

    yield 1;
    yield 0;
    yield 1;
    yield 0;

    yield 1;
    yield 0;
    yield 1;
    yield 1;

    yield 1;
    yield 1;
    yield 0;
    yield 0;

    yield 1;
    yield 1;
    yield 0;
    yield 1;

    yield 1;
    yield 1;
    yield 1;
    yield 0;

    yield 1;
    yield 1;
    yield 1;
    yield 1;
}

class Stat {
    source;
    channel1;
    channel2;
    channel3;

    constructor(source, channel1, channel2, channel3) {
        this.source = source;
        this.channel1 = channel1;
        this.channel3 = channel3;
        this.channel2 = channel2;
    }

    toString() {
        return `${this.source}${this.channel1}${this.channel2}${this.channel3}`;
    }
}

class SMO {
    constructor(p, pi1, pi2, pi3) {
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
        this.currValue = "1000";
        this.stats = {};
        this.nextValues = {};
        this.nextValues[this.currValue] = [];
        this.allValues = ["1000"];
    }

    duplicateNZeroes(n){
        let res = '';

        for(let i = 0 ; i < n; ++i){
            res += '0';
        }

        return res;
    }

    getTransitionsForChannels(source, channel1, channel2, channel3){
        let numberOfTransitions = 2 ** (source + channel1 + channel2 + channel3);

        let res = [];

        let maxBinaryLength = Math.log2(numberOfTransitions);

        for (let i = 0; i < numberOfTransitions; i++) {
            let sequence = i.toString(2);

            if(sequence.length < maxBinaryLength){
                sequence = `${this.duplicateNZeroes(maxBinaryLength - sequence.length)}${sequence}`;
            }

            let generatedTransition = {

            }

            if(source && !channel1 && !channel2 && !channel3){
                generatedTransition.source = Number(this.getElemFromSequence(sequence.length - 1, sequence));          
            }

            if(source && !channel1 && !channel2 && channel3){
                generatedTransition.source = Number(this.getElemFromSequence(sequence.length - 1, sequence));  
                generatedTransition.channel3 = Number(this.getElemFromSequence(sequence.length - 2, sequence));         
            }

            if(source && !channel1 && channel2 && !channel3){
                generatedTransition.source = Number(this.getElemFromSequence(sequence.length - 1, sequence));   
                generatedTransition.channel2 = Number(this.getElemFromSequence(sequence.length - 2, sequence));       
            }

            if(source && !channel1 && channel2 && channel3){
                generatedTransition.source = Number(this.getElemFromSequence(sequence.length - 1, sequence)); 
                generatedTransition.channel2 = Number(this.getElemFromSequence(sequence.length - 2, sequence));    
                generatedTransition.channel3 = Number(this.getElemFromSequence(sequence.length - 3, sequence));       
            }

            if(source && channel1 && !channel2 && !channel3){
                generatedTransition.source = Number(this.getElemFromSequence(sequence.length - 1, sequence)); 
                generatedTransition.channel1 = Number(this.getElemFromSequence(sequence.length - 2, sequence));        
            }

            if(source && channel1 && !channel2 && channel3){
                generatedTransition.source = Number(this.getElemFromSequence(sequence.length - 1, sequence)); 
                generatedTransition.channel1 = Number(this.getElemFromSequence(sequence.length - 2, sequence));    
                generatedTransition.channel3 = Number(this.getElemFromSequence(sequence.length - 3, sequence));        
            }

            if(source && channel1 && channel2 && !channel3){
                generatedTransition.source = Number(this.getElemFromSequence(sequence.length - 1, sequence)); 
                generatedTransition.channel1 = Number(this.getElemFromSequence(sequence.length - 2, sequence));    
                generatedTransition.channel2 = Number(this.getElemFromSequence(sequence.length - 3, sequence));        
            }

            if(source && channel1 && channel2 && channel3){
                generatedTransition.source = Number(this.getElemFromSequence(sequence.length - 1, sequence)); 
                generatedTransition.channel1 = Number(this.getElemFromSequence(sequence.length - 2, sequence));    
                generatedTransition.channel2 = Number(this.getElemFromSequence(sequence.length - 3, sequence)); 
                generatedTransition.channel3 = Number(this.getElemFromSequence(sequence.length - 4, sequence));        
            }

////////////////////////
            if(!source && !channel1 && !channel2 && channel3){
                generatedTransition.channel3 = Number(this.getElemFromSequence(sequence.length - 1, sequence));         
            }

            if(!source && !channel1 && channel2 && !channel3){ 
                generatedTransition.channel2 = Number(this.getElemFromSequence(sequence.length - 1, sequence));       
            }

            if(!source && !channel1 && channel2 && channel3){
                generatedTransition.channel2 = Number(this.getElemFromSequence(sequence.length - 1, sequence));    
                generatedTransition.channel3 = Number(this.getElemFromSequence(sequence.length - 2, sequence));       
            }

            if(!source && channel1 && !channel2 && !channel3){
                generatedTransition.channel1 = Number(this.getElemFromSequence(sequence.length - 1, sequence));        
            }

            if(!source && channel1 && !channel2 && channel3){
                generatedTransition.channel1 = Number(this.getElemFromSequence(sequence.length - 1, sequence));    
                generatedTransition.channel3 = Number(this.getElemFromSequence(sequence.length - 2, sequence));        
            }

            if(!source && channel1 && channel2 && !channel3){ 
                generatedTransition.channel1 = Number(this.getElemFromSequence(sequence.length - 1, sequence));   
                generatedTransition.channel2 = Number(this.getElemFromSequence(sequence.length - 2, sequence));      
            }

            if(!source && channel1 && channel2 && channel3){
                generatedTransition.channel1 = Number(this.getElemFromSequence(sequence.length - 1, sequence));    
                generatedTransition.channel2 = Number(this.getElemFromSequence(sequence.length - 2, sequence)); 
                generatedTransition.channel3 = Number(this.getElemFromSequence(sequence.length - 3, sequence));        
            }
            

            res.push(generatedTransition);
        }

        return res;
    }

    getElemFromSequence(prefferedPos, sequence){
        //currentIteration = 5;

        while(sequence[prefferedPos] === undefined){
            ++prefferedPos;
            // ++currentIteration;

            // if(currentIteration > 5){
            //     prefferedPos = 0;
            //     break;
            // }
        }

        return sequence[prefferedPos];
    }

    format(x){
        return x === undefined ? '' : x;
    }

    processNextStep() {
        //let generator = lemenGenerator();
        let numOfLoops = 2 ** (this.channel2 + this.channel1 + this.channel3 + this.source);
        this.currValue = this.statToString();
        this.nextValues[this.currValue] = [];
        //generate "1111" sequence instead of generator.next
        let maxBinaryLength = Math.log2(16);
        
        let generatedSequence = this.getTransitionsForChannels(this.source, this.channel1, this.channel2, this.channel3);

        console.log(generatedSequence.map(x => `${this.format(x.source)}${this.format(x.channel1)}${this.format(x.channel2)}${this.format(x.channel3)}`))

        //console.log(generatedSequence);

        let x = `${this.source}${this.channel1}${this.channel2}${this.channel3}`;

        for (let i = 0; i < numOfLoops; i++) {
            // let sequence = i.toString(2);

            // if(sequence.length < maxBinaryLength){
            //     sequence = `${this.duplicateNZeroes(maxBinaryLength - sequence.length)}${sequence}`;
            // }
            let nextSource = this.source;
            let nextChannel1 = this.channel1;
            let nextChannel2 = this.channel2;
            let nextChannel3 = this.channel3;

            // if(nextSource && nextChannel1 && nextChannel2 && !nextChannel3){
            //     console.log(123)
            // }

            let rejected = false;
            let multPi1 = "";
            let multPi2 = "";
            let multPi3 = "";
            let multP = "";

            if (nextChannel3) {
                if (1 - this.pi3 < generatedSequence[i].channel3) {
                    nextChannel3 = 0;
                    multPi3 = "(1-π3)";
                } else {
                    multPi3 = "π3"
                }
            }
            if (nextChannel2) {
                if (1 - this.pi2 < generatedSequence[i].channel2) {
                    nextChannel2 = 0;
                    multPi2 = "(1-π2)";
                } else {
                    multPi2 = "π2"
                }
            }
            if (nextChannel1) {
                if (1 - this.pi1 < generatedSequence[i].channel1) {
                    multPi1 = "(1-π1)";
                    if (nextChannel2 && nextChannel3) {
                        nextChannel1 = 0;
                        rejected = true;
                    } else if(!nextChannel2) {
                        nextChannel1 = 0;
                        nextChannel2 = 1;
                    }else if(!nextChannel3){
                        nextChannel1 = 0;
                        nextChannel3 = 1;
                    }
                } else {
                    multPi1 = "π1";
                }
            }

            if(nextSource){
                if((1 - this.p < generatedSequence[i].source)){
                    multP = "(1 - p)";

                    if(nextChannel1){
                        nextSource = 0;
                        this.blocked++;
                    }else{
                        nextChannel1 = 1;
                    }
                }else{
                    multP = "p";
                }
            }else if(!nextSource){
                if(!nextChannel1){
                    nextSource = 1;
                    nextChannel1 = 1;  
                }else{
                    this.blocked++;
                }
            }

    
            

            this.saveStats(nextSource, nextChannel1, nextChannel2, nextChannel3, multPi1, multPi2, multPi3,multP,rejected);
            let nextStat = this.nextStatToString(nextSource, nextChannel1, nextChannel2, nextChannel3);
            if (this.allValues.indexOf(nextStat) === -1) {
                this.allValues.push(nextStat);
            }
        }
    }

    calculate() {
        for (let value of this.allValues) {
            this.decodeValue(value);
            this.processNextStep();
        }

        for (let value of this.allValues) {
            this.nextValues
        }
    }

    decodeValue(value) {
        this.source = Number(value[0]);
        this.channel1 = Number(value[1]);
        this.channel2 = Number(value[2]);
        this.channel3 = Number(value[3]);
    }

    statToString() {
       return new Stat(this.source, this.channel1, this.channel2, this.channel3).toString();
    }

    nextStatToString(nextSource, nextChannel1, nextChannel2, nextChannel3) {
        return new Stat(nextSource, nextChannel1, nextChannel2, nextChannel3).toString();
    }

    saveStats(nextSource, nextChannel1, nextChannel2, nextChannel3, pi1, pi2, pi3,p, rejected) {
        let stat = new Stat(nextSource, nextChannel1, nextChannel2, nextChannel3).toString();
        this.nextValues[this.currValue].push(`${p}${pi1}${pi2}${pi3}P${stat}${rejected ? ', rejected' : ''}`);
    }
}