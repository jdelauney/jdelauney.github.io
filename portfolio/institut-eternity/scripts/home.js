import {Collapsable} from "./lib/components/collapsable.js";
import {GaugeMeter} from "./lib/components/gaugemeter.js";
import IdealWeightCalculator from "./IdealWeightCalculator.js";
import {DropDown} from "./lib/components/dropdown.js";
import {Tooltipsable} from "./lib/components/tooltipsable.js";

let iwGauge = null;
let imcGauge = null;

const footerReveal = () => {
	const footerHeight = document.querySelector('#main-footer').clientHeight;
	document.querySelector('#main-wrapper').style.marginBottom = `${footerHeight}px`;
}

window.addEventListener("DOMContentLoaded", () => {
	Collapsable.bind();
	DropDown.bind();
	Tooltipsable.bind();
	iwGauge = new GaugeMeter('#iw_gauge-meter');
	imcGauge = new GaugeMeter('#imc_gauge-meter');
	footerReveal();
});

window.addEventListener('resize', footerReveal);

Array.from(document.querySelectorAll(".footer__menu-link")).map((element) => {
	element.addEventListener('click', () => {
		setTimeout(() => {
			footerReveal();
			window.scrollTo(0,document.body.scrollHeight);
		}, 50);
	});
});

document.querySelector("#back-to-top").addEventListener('click', ()=> {
	window.scrollTo(0,0);
})

const imcForm = document.getElementById("imcForm")

imcForm.addEventListener("submit", (event) => {
	event.preventDefault();
	const formData = new FormData(imcForm);

	const gender = formData.get('gender');
	const size = formData.get('size');
	const weight = formData.get('weight');
	const age = formData.get('age');
	const morphologie = formData.get('morphologie');
	const wirstSize = formData.get('wirstSize');
	const chestSize = formData.get('chestSize');

	const imcResult = document.querySelector("#imcResult");

	const iwCalculator = new IdealWeightCalculator();

	const sizeInMeter = parseFloat(size) / 100;
	const result = iwCalculator.computeIdealWeight(Number(gender), sizeInMeter, Number(age), Number(morphologie), wirstSize, chestSize);
	console.log(result);
	const averageIW = result.averageIdeal
	iwGauge.setValue(averageIW);
	const imc = iwCalculator.computeBMI(sizeInMeter, weight);
	const img = iwCalculator.computeIMG(gender, sizeInMeter, weight, age);
	imcGauge.setValue(imc);

	const averageIdealWeight = document.querySelector("#averageIdealWeight");
	averageIdealWeight.innerText = averageIW.toFixed(2);
	const averageIdealWeightMin = document.querySelector(("#averageIdealWeightMin"));
	averageIdealWeightMin.innerText = result.minAverage.toFixed(2);
	const averageIdealWeightMax = document.querySelector(("#averageIdealWeightMax"));
	averageIdealWeightMax.innerText = result.maxAverage.toFixed(2);
	const imcValue = document.querySelector("#imc_value");
	imcValue.innerText =  imc.toFixed(2);
	const imgValue = document.querySelector("#img_value");
	imgValue.innerText =  img.toFixed(2);
	const imcDesc = document.querySelector("#imc_desc");
	imcDesc.innerText = iwCalculator.getBMIInterpretation(imc)
	const imgDesc = document.querySelector("#img_desc");
	imgDesc.innerText = iwCalculator.getIMGInterpretation(img)
	//let iwAverage
  imcResult.classList.add('open');
})