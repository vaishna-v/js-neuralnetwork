# js-neuralnetwork
# Project Overview

## Dependencies
```sh
npm install mathjs
```
### Note:
I made this project to understand the working of a simple vanilla neural networks. As a result, this network is not very optimized—it's slow and inefficient. It is very much prone to errors considering how unpolished it is. I am only publishing it as it is my first project.

**ALSO:**  
My network DOES NOT contain biases.

### Working

#### 1. Making a Neural Network
You can simply create a neural network object "n" by:
```javascript
let n = network([4, 5, 4]);
```
As a parameter, you are supposed to pass the number of neurons in each layer. In the above example, my input layer has 4 neurons, the middle/hidden layer has 5, and the output layer has 4 neurons. It will automatically generate randomized weights for all the layers.



#### 2. Accessing Weights
```javascript
weights = n.weights;
```
This retrieves all the weights in the network. The weights are a multidimensional array. More on their arrangement later.



#### 3.Training the Network
```javascript
n.train(inputLayer, idealOutputLayer);
```
Calling this method automatically trains the network for a given input and output value. It also updates the weights on its own.



#### 4.Activate Neurons
```javascript
n.getActivation([inputLayer]);
```
This is used to show activations of all neurons in all layers. The method returns an array with two elements: the first element stores the activation of all neurons when sigmoid functions have been applied, and the second element stores all activation layers without the sigmoid functions (raw data).

If you want to obtain the activations of the output layer with sigmoid applied, you can do so by (assuming the network has 3 total layers):
```javascript
outcome = n.predictOutcome([inputLayer])[0][2];
```



#### 5. Cost Function
I have defined the cost function outside the network object. Therefore, for any idealLayer and actualLayer, the cost function can be used by:
```javascript
let cost = cost(actualLayer, idealLayer);
```
The cost function returns a numeric value which is equal to sum of squares of difference between real and ideal value.




### Arrangement of Weight Matrix
#### a) Arrangement of Weight for a Network Having Only Two Layers
Consider two consecutive (L and L+1) layers of the network, with 5 and 7 neurons each. The weight array for these two layers will have 7 elements (arrays), and each element will have 5 elements (numbers).

For the first array:

The first element will be equal to the weight between the first neuron of L+1 and the first neuron in L.

The second element will be equal to the weight between the first neuron of L+1 and the second neuron in L.

Similarly, for the 4th array:

The first element will be equal to the weight of the fourth neuron of the L+1 array to the first neuron in the L layer.



#### b) Arrangement for a Network Having Multiple Layers
If a network has multiple layers, say the consecutive layers have 4, 5, 6, and 7 neurons each, then the weight matrix will have 3 elements:

The first element will correspond to the weight between the first and second layer.

The second element will correspond to the weight between the second and third layer.

The third element will correspond to the weight between the third and fourth layer.



### Some Other Functions Defined Outside the Network Class
* derivativeForWeight
* derivativeForActivation
* generateNeurons
* sigmoidActivations



