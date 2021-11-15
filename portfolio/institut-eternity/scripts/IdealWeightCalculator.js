export default class IdealWeightCalculator {
  static MORPHOLOGY = {
	  fine:0,
	  normal:1,
	  wide:2
  }

	static GENDER = {
		man:0,
		woman:1,
	}

	static COEF_LORENTZ_MAN      = 4.0
	static COEF_LORENTZ_WOMAN    = 2.5
	static COEF_LORENTZ_SIZE     = 150
	static COEF_LORENTZ_SIZE_AGE = 50
	static COEF_LORENTZ_AGE      = 20

	static COEF_CREFF_AGE = 10.0
	static COEF_CREFF_A   = 0.9
	static COEF_CREFF_B   = 1.1

	static COEF_MONNERO_FINE = 4
	static COEF_MONNERO_NORMAL = 6
	static COEF_MONNERO_WILD = 8


	static COEF_DEVINE_MAN = 50
	static COEF_DEVINE_WOMAN = 45.5
	static COEF_DEVINE_A = 2.3
	static COEF_DEVINE_B = 60

	static COEF_BONHARDT = 240

	static COEF_IMG_A = 1.20
	static COEF_IMG_B = 0.23
	static COEF_IMG_C = 10.8
	static COEF_IMG_D = 5.4
	static COEF_IMG_MAN = 1
	static COEF_IMG_WOMAN = 0

	constructor() {


		this._InchToCentimer = 2.54
		this._BMI_INTERPREATION = ['vous êtes en insuffisance pondérale', 'vous avez une corpulence normale', 'vous êtes en surpoids', 'vous êtes en obésité modérée', 'vous êtes en obésité sévère', 'vous êtes en obésité morbide']
		this._IMG_INTERPREATION = ['vous êtes trop maigre', 'vous avez un indice de graisse normal', 'vous avez un indice de graisse trop élevé']
	}

	computeLorentz(gender, size, age) {
			if (gender === IdealWeightCalculator.GENDER.man) {
			  return IdealWeightCalculator.COEF_LORENTZ_SIZE_AGE + (( size * 100 - IdealWeightCalculator.COEF_LORENTZ_SIZE ) / IdealWeightCalculator.COEF_LORENTZ_MAN ) + (( age - IdealWeightCalculator.COEF_LORENTZ_AGE  ) / IdealWeightCalculator.COEF_LORENTZ_MAN );
			}
			else {
				return IdealWeightCalculator.COEF_LORENTZ_SIZE_AGE + (( size * 100 - IdealWeightCalculator.COEF_LORENTZ_SIZE ) / IdealWeightCalculator.COEF_LORENTZ_WOMAN ) + (( age - IdealWeightCalculator.COEF_LORENTZ_AGE  ) / IdealWeightCalculator.COEF_LORENTZ_WOMAN );
			}
	}

	computeCreff(size, age, morphology) {
     switch (morphology) {
	     case IdealWeightCalculator.MORPHOLOGY.fine:
				 return ((( size * 100 - 100 ) + ( age / IdealWeightCalculator.COEF_CREFF_AGE)) * IdealWeightCalculator.COEF_CREFF_A * IdealWeightCalculator.COEF_CREFF_A);
	     case IdealWeightCalculator.MORPHOLOGY.normal:
		     return ((( size * 100 - 100 ) + ( age / IdealWeightCalculator.COEF_CREFF_AGE)) * IdealWeightCalculator.COEF_CREFF_A);
	     case IdealWeightCalculator.MORPHOLOGY.wide:
		     return ((( size * 100 - 100 ) + ( age / IdealWeightCalculator.COEF_CREFF_AGE)) * IdealWeightCalculator.COEF_CREFF_A * IdealWeightCalculator.COEF_CREFF_B);
     }
	}

	computeMonnerotDumaine(size, wristDiameter, morphology) {
		switch (morphology) {
			case IdealWeightCalculator.MORPHOLOGY.fine:
				return ((size * 100) - 100 + (IdealWeightCalculator.COEF_MONNERO_FINE * wristDiameter)) * 0.5
			case IdealWeightCalculator.MORPHOLOGY.normal:
				return ((size * 100) - 100 + (IdealWeightCalculator.COEF_MONNERO_NORMAL * wristDiameter)) * 0.5
			case IdealWeightCalculator.MORPHOLOGY.wide:
				return ((size * 100) - 100 + (IdealWeightCalculator.COEF_MONNERO_WILD * wristDiameter)) * 0.5
		}
	}

	computeDevine(gender, size) {
		console.log('Gender = ', gender)
		let sizeInInch = ((size * 100) / this._InchToCentimer)
		console.log('SizeInInch = ', sizeInInch)
		let b = IdealWeightCalculator.COEF_DEVINE_A * (sizeInInch - IdealWeightCalculator.COEF_DEVINE_B)
		console.log('b = ', b)
		if (gender === IdealWeightCalculator.GENDER.man) {

			return IdealWeightCalculator.COEF_DEVINE_MAN + b
		}
		else {
			return IdealWeightCalculator.COEF_DEVINE_WOMAN + IdealWeightCalculator.COEF_DEVINE_A * ((((size * 100) / this._InchToCentimer)) - IdealWeightCalculator.COEF_DEVINE_B)
		}
	}

	computeBonhardt(size, chestSize) {
		return ((size * 100) * chestSize) / IdealWeightCalculator.COEF_BONHARDT
	}

	computeBMI(size, weight) {
		return weight / (size * size)

		// s = 1.80
		// w = 95
		// x = 29.32


		// x = w / (s * s)
		// 29.32 = 95 / (1.8 * 1.8)

		// S = (s * s) = 3.24

		// w = x * (s * s)

	}

	computeBMIIdealWeight(size) {
		return 21.5 * (size * size)
	}

	getBMIInterpretation(bmi) {
		IdealWeightCalculator.COEF_BMI =[18.5, 25, 30, 35, 40]
		if (bmi < 18.5) {
			return this._BMI_INTERPREATION[0]
		}
		else if ((bmi >= 18.5) && (bmi < 25)) {
			return this._BMI_INTERPREATION[1]
		}
		else if ((bmi >= 25) && (bmi < 30)) {
			return this._BMI_INTERPREATION[2]
		}
		else if ((bmi >= 30) && (bmi < 35)) {
			return this._BMI_INTERPREATION[3]
		}
		else if ((bmi >= 35) && (bmi < 40)) {
			return this._BMI_INTERPREATION[4]
		}
		else if (bmi >= 40) {
			return this._BMI_INTERPREATION[5]
		}
	}

	computeIMG(gender, size, weight, age ) {

		/*
		La première formule de Deurenberg :
			IMG (%) = (1.20∗IMC) + (0.23∗Age) − (10.8∗Sexe) − 5.4

		La seconde formule de Deurenberg :
			IMG (%) = (1.29∗IMC) + (0.20∗Age) − (11.4∗Sexe) − 8.0

		La formule de Gallagher :
			IMG (%) = (1.46∗IMC) + (0.14∗Age) − (11.6∗Sexe) − 10.0

		La formule de Jackson-Pollock :
		IMG (%) = (1.61∗IMC) + (0.13∗Age) − (12.1∗Sexe) − 13.9

		Pour les enfants de 15 ans ou moins, Deurenberg a toutefois mis au point une formule différente :

		IMG (%) = (1.51∗IMC) + (0.70∗Age) − (3.6∗Sexe) + 1.4
		*/
		const coef = (gender === IdealWeightCalculator.GENDER.man) ? IdealWeightCalculator.COEF_IMG_WOMAN : IdealWeightCalculator.COEF_IMG_MAN
		console.log(coef)
		const bmi =  this.computeBMI(size, weight)
		return (IdealWeightCalculator.COEF_IMG_A * bmi) + (IdealWeightCalculator.COEF_IMG_B * age) - (coef * IdealWeightCalculator.COEF_IMG_C) - IdealWeightCalculator.COEF_IMG_D
	}

	getIMGInterpretation(gender, img) {
		if (gender === IdealWeightCalculator.GENDER.man) {
			if (img < 15) {
				return this._IMG_INTERPREATION[0]
			}
			else if ((img >=15) && (img < 20)) {
				return this._IMG_INTERPREATION[1]
			}
			else {
				return this._IMG_INTERPREATION[2]
			}
		}
		else {
			if (img < 25) {
				return this._IMG_INTERPREATION[0]
			}
			else if ((img >=25) && (img < 30)) {
				return this._IMG_INTERPREATION[1]
			}
			else {
				return this._IMG_INTERPREATION[2]
			}
		}
	}

	computeExcessedWeight(weight) {
		return weight + (weight * 0.1)
	}

	computeAverageIdealWeight(gender, size, age, morphology, wristSize, chestSize) {
		const lorentz = this.computeLorentz(gender, size, age)
		const creff = this.computeCreff(size, age, morphology)
		const devine = this.computeDevine(gender, size)
		let divider = 3
		let monnerotDumaine = 0
		if (wristSize) {
			monnerotDumaine = this.computeMonnerotDumaine(size)
			++divider
		}
		let bonhardt = 0
		if (chestSize) {
			bonhardt = this.computeBonhardt(size, chestSize)
			++divider
		}

		return (lorentz + creff + devine + monnerotDumaine + bonhardt) / divider
	}

	computeIdealWeight(gender, size, age, morphology, wristSize, chestSize) {
		console.log('SIZE = ', size)
		const arr = []
		arr.push(this.computeLorentz(gender, size, age))
		arr.push(this.computeCreff(size, age, morphology))
		let devine = this.computeDevine(gender, size)
		console.log('DEVINE = ', devine)
		arr.push(devine)
		let divider = 3

		let monnerotDumaine = 0
		if (wristSize) {
			arr.push(this.computeMonnerotDumaine(size, Number(wristSize), morphology))
			++divider
		}
		let bonhardt = 0
		if (chestSize) {
			arr.push(this.computeBonhardt(size, Number(chestSize)))
			++divider
		}
		console.log('Result = ', arr)

		const minWeight = Math.min(...arr)
		const maxWeight = Math.max(...arr)
		const diff = maxWeight - minWeight
		const weightSum = arr.reduce((sum, a) => sum + a, 0);
		const averageIdeal = (weightSum / divider)
		const average = (maxWeight - (diff * 0.5))
		const maxAverage = averageIdeal + (averageIdeal * 0.1)
		const minAverage = averageIdeal - (averageIdeal * 0.1)
		return {
			minWeight : minWeight,
			maxWeight : maxWeight,
			average : average,
			averageIdeal : averageIdeal,
			minAverage : minAverage,
			maxAverage : maxAverage,
			ideal : (minWeight + ((maxWeight - minWeight) * 0.5)),
			excessive : this.computeExcessedWeight(average)
		}
	}
}