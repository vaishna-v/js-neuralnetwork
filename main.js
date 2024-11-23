const math = require("mathjs");



/* Summary of (some) function-


1) costFunction
    Inputs: 2 arrays(A and B):
        A -> array: Ideal activations of neurons in any layer(generally final layer)
        B -> array: Current activations of neurons in that same layer
    Outputs: Returns the value of cost function( a number )
2) forwardPropogation
    Inputs - 2 arrays(A, B)
        A -> array: activation of neurons in the known layer, ie if u want to find neurons in third layer then A will have activations in layer 2
        B -> multi-array: Weights of known layer with unknown layer arranged in multidimensional array
            Arrangement of weights in B:
                If known layer has 5 neurons, and unknown has 10, then number of arrays in B = 10
                   First element of nth array will be: Weight of first neuron in known layer with  nth neuron in unknown layer, similarly-
                Second element of nth array will be: Weight of second neuron in known layer with nth neuron in unknown layer.

                Basically each array contains all weights corresponding to a neuron in unknwon layer
    Output: Returns an array of activation of neurons in unknown layer
3) generateActivation
    Inputs: One number(n)
        n -> positive integer: number of activations to be produced, basically if a layer has 4 neurons then ofc 4 activations will be produced.
    Output: Returns an array of "n" random activations.
4) generateWeight
    Inputs: A,B,C,D
        A -> positive integer: Number of neurons in first layer
        B -> positive integer: Number of neurons in second layer
        C(default=-20) -> number: Upper limit of weights to be generated
        D(default=-20) -> number: Lower limit of weights to be generated
    Output: A multidimension array containing weight, arrangement of weight is same as input B in (2)forwardPropogation.


let reqOutput = [0,0,0,1,0,0,0,0,0];
let realOutput = [0.4,0.2,0.6,1,0.4,0.87,0,0,0.3];

let activation = [[], [], [], []]


*/

// A function for forward propogation-
// the function takes 5 inputs which are- Layer which already exists(whose activation will be taken), a list of all activations in layer, a list of all weigths in that layer with other layer
// number of neurons in next layer, list for bias for each neuron(if exist) the function will return a list where each value correspond to activation of a neuron in next layer
function forwardPropogation(activations, weights )
    {
        let activation = math.matrix(activations);
        
        // How weights exist-
        // say knwon layer(j) has 3 neurons, whereas unknown(j+1) has 5.
        // weights will contain 5 lists inside it, each list will have 3 elements in it
        //weights list 1 element 1 - the weight of first neuron in knwon layer with first neuron in unknown layer
        // weights list1 element2 - the wieght of second neuron in known layer with first neuron in unknown layer
        // therefore finalLayer[0] = weight[0][0]*activatino[0] + weight[0][1]*activation[1] +....+ weight[0][4]*activation[1] - bias[0]

        let outputLayer = [];
        let length=weights.length;
        let currentActivation;
        outputLayer = math.multiply(weights, math.transpose(activation));
        outputLayer=outputLayer.valueOf();
        return outputLayer;
    }


// To find cost function value for given-
function costFunction(realOutput, reqOutput)
    {
        let sum=0;
        for(let i=0; i<realOutput.length; i++){
            sum = sum + (reqOutput[i]-realOutput[i])*(reqOutput[i]-realOutput[i])
        }
        return sum;
        }

// To generate activation of neurons randomly without applying sigmoid-
function pureActivation(number, lower_limit=-10, upper_limit=10)
        {
            let output=[];
            for(let i=0; i<number; i++)
                {
                    output.push((Math.random()*(upper_limit-lower_limit)+lower_limit ));
                }
            return output;
        }

// To generate activation of neurons randomly, generates one layer at a time-
function sigmoidActivation(randomActivation, k=0.01)
{
    let output=[];
    length = randomActivation.length;
    for(let i=0; i<length; i++)
        {
            term = 1 /(1+Math.pow(Math.E, (-1*k*randomActivation[i])));   
            output.push(term);
        }
    return output;
}



// To generate weights of neurons randomly, generates one multidimensional array-
function generateWeight(known_activation, unknown_activation, upper_limit=20, lower_limit=-20)
    {
        finalOutput = [];
        for(let i=0;  i<unknown_activation; i++)
            {
                let middleOutput = [];
                for(let k=0; k<known_activation; k++)
                {
                    middleOutput.push((Math.random()*(upper_limit-lower_limit))+lower_limit);
                }
                finalOutput.push(middleOutput);
            }
        return finalOutput;
    }

function derivativeforWeight(outputLayer, idealLayer, nonsigmoid, previousLayer){
    let outputLength = outputLayer.length;
    let previousLenght = previousLayer.length;
    let finalOutput = [];
    let middleOutput=[];
    let term;
    for(let i=0; i<outputLength; i++)
        {   
            term = 2*(outputLayer[i]-idealLayer[i]);
            middle_term= Math.pow(Math.E, -1*0.01*nonsigmoid[i]) // derivative of sigmoid of z. z=activation*weight + bias => 
            term=term*(0.01*middle_term)/((1+middle_term)**2);
            finalOutput.push(math.multiply(previousLayer , term));
        }
    return finalOutput;
}

function derivativeforActivation(activation_j, activation_j_1, nonsigmoid_j1, weight, idealLayer, k=0.01){
    let i;
    let j;
    let jlength = activation_j.length;
    let j1length = activation_j_1.length;
    let output = [];
    let middle_term, term, added_term;
    for(i=0; i<jlength; i++){
        added_term=0
        for(j=0; j<j1length; j++){
            term=2*(activation_j_1[j]-idealLayer[j]);
            middle_term=Math.pow(Math.E, -1*k*nonsigmoid_j1[j]) // derivative of sigmoid of z. z=activation*weight + bias => 
            term=term*(k*middle_term)/((1+middle_term)**2);
            term = term*weight[j][i];
            added_term=added_term+term;
        }
        output.push(added_term);
    }
    return output;
}

class network{
    // neuronNumber -> an array containing number of arrays in each layyer, number of elemnts in this array = number of layers(including input and output layer)

    //structure of weight matrix-
    // first element corresponds to the weighjt between Input (1) and second layer (2)
    // second element corresponds to the weight between second layer(2) and third layer(3)
    // total number of elements in weight matrix = neuronNumber-1
    constructor(neuronNumber){
        // I want to now, make weights for layer 1, layer 2 and layer 2, layer 3 and so on...
        this.weights = []
        this.neuronNumber=neuronNumber;
        let middleElement;
        let i;
        let weightLength=neuronNumber.length-1;
        for(i=0; i<weightLength; i++){
            middleElement=generateWeight(neuronNumber[i], neuronNumber[i+1]);
            this.weights.push(middleElement)
        }
    }



        // Actual forward propogation
        // It will output a multidimensional array, each element of that array corresponds to the activation of each layer in neural network for the input(includes input too)-
        getActivation(inputLayer){
            let i;
            let activation = [];
            let sactivation = [];
            activation.push(inputLayer);
            sactivation.push(inputLayer);
            let numberLayer = this.neuronNumber.length;
            let term = []
            for(i=1; i<numberLayer; i++){
                term = forwardPropogation(activation[i-1], this.weights[i-1])
                sactivation.push(term);
                term = sigmoidActivation(term, 0.01);
                activation.push(term);
            }
            return [activation, sactivation];
        }
        // back propogation-
        /* User will give me idealLayer for output
        I will update the weights on my own
        */
        backpropogate(idealLayer, sactivations, activation){
            let i;
            let derivativeActivation, derivativeWeight;
            let numberLayer = this.neuronNumber.length-1;
            let newweight = [];
            let term;
            for(i=0; i<numberLayer; i++){
                derivativeActivation = derivativeforActivation(activation[numberLayer-i-1], activation[numberLayer-i], sactivations[numberLayer-i], this.weights[numberLayer-i-1], idealLayer, 0.01);
                derivativeWeight = derivativeforWeight(activation[numberLayer-i], idealLayer, sactivations[numberLayer-i], activation[numberLayer-i-1])
                idealLayer=math.subtract(activation[numberLayer-i-1], derivativeActivation);
                this.weights[numberLayer-i-1] =  math.subtract(this.weights[numberLayer-i-1], math.multiply(500, derivativeWeight));
            }
        }

        train(inputLayer, outputLayer){
            let overall;
            let activation;
            let sactivation;
            overall =this.getActivation(inputLayer, outputLayer);
            activation=overall[0];
            sactivation=overall[1];
            this.backpropogate(outputLayer, sactivation, activation);
        }

}



