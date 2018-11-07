declare module "activations.json" {
    const activation: Activation[];
    export default activation;
}

type Activation = {
	activationPath: string;
	activationName: string
}