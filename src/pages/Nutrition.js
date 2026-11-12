
import React, { useState, useEffect } from 'react';

function Nutrition() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [activity, setActivity] = useState('');
  const [waist, setWaist] = useState('');
  const [neck, setNeck] = useState('');
  const [rate, setRate] = useState('');
  const [goalType, setGoalType] = useState('lose');

  const [profileMsg, setProfileMsg] = useState('');
  const [bmiMsg, setBmiMsg] = useState('');
  const [bmrMsg, setBmrMsg] = useState('');
  const [fatMsg, setFatMsg] = useState('');
  const [leanMsg, setLeanMsg] = useState('');
  const [goalMsg, setGoalMsg] = useState('');

  // Load saved profile
  useEffect(() => {
    const savedProfile = JSON.parse(
      localStorage.getItem('profile')
    );

    if (savedProfile) {
      setWeight(savedProfile.weight);
      setHeight(savedProfile.height);
      setAge(savedProfile.age);
      setGender(savedProfile.gender);
    }
  }, []);

  // Validation
  const isValid = (n) =>
    n !== '' &&
    n !== null &&
    n !== undefined &&
    !isNaN(n) &&
    isFinite(n);

  // Require saved profile
  const requireProfile = () => {
    const profileExists = localStorage.getItem('profile');

    if (
      !isValid(weight) ||
      !isValid(height) ||
      !isValid(age) ||
      !profileExists
    ) {
      return false;
    }

    return JSON.parse(profileExists);
  };

  // SAVE PROFILE
  const saveProfile = () => {
    if (
      !isValid(weight) ||
      !isValid(height) ||
      !isValid(age) ||
      Number(weight) <= 0 ||
      Number(height) <= 0 ||
      Number(age) <= 0
    ) {
      setProfileMsg('❌ Error: Fill all profile fields');
      return;
    }

    const profileData = {
      weight: parseFloat(weight),
      height: parseFloat(height),
      age: parseFloat(age),
      gender
    };

    localStorage.setItem(
      'profile',
      JSON.stringify(profileData)
    );

    setProfileMsg('✔ Profile saved successfully');
  };

  // BMI CALCULATOR
  const calcBMI = () => {
    const p = requireProfile();

    if (!p) {
      setBmiMsg('❌ Access Denied: Enter and Save Profile first');
      return;
    }

    const bmiVal =
      p.weight / ((p.height / 100) ** 2);

    setBmiMsg(`BMI: ${bmiVal.toFixed(1)}`);
  };

  // BMR + MAINTENANCE CALCULATOR
  const calcBMR = () => {
    const p = requireProfile();

    if (!p) {
      setBmrMsg('❌ Access Denied: Enter and Save Profile first');
      return;
    }

    if (!isValid(activity)) {
      setBmrMsg('❌ Select activity level');
      return;
    }

    const baseBmr =
      p.gender === 'male'
        ? 10 * p.weight + 6.25 * p.height - 5 * p.age + 5
        : 10 * p.weight + 6.25 * p.height - 5 * p.age - 161;

    const maintenance = baseBmr * parseFloat(activity);

    // Save ORIGINAL maintenance calories
    localStorage.setItem('bmr', maintenance);

    // Clear old calorie goal when maintenance is recalculated
    localStorage.removeItem('calorieGoal');

    setBmrMsg(
      `Maintenance: ${maintenance.toFixed(0)} kcal`
    );
  };

  // BODY FAT CALCULATOR
  const calcBodyFat = () => {
    const p = requireProfile();

    if (!p) {
      setFatMsg('❌ Access Denied: Enter and Save Profile first');
      return;
    }

    if (!isValid(waist) || !isValid(neck)) {
      setFatMsg('❌ Need Waist & Neck');
      return;
    }

    const parsedWaist = parseFloat(waist);
    const parsedNeck = parseFloat(neck);

    if (parsedWaist <= parsedNeck || parsedNeck <= 0) {
      setFatMsg('❌ Enter valid Waist and Neck measurements');
      return;
    }

    const bfVal =
      495 /
      (
        1.0324 -
        0.19077 * Math.log10(parsedWaist - parsedNeck) +
        0.15456 * Math.log10(p.height)
      ) - 450;

    localStorage.setItem('bf', bfVal);

    setFatMsg(
      `Body Fat: ${bfVal.toFixed(1)}%`
    );
  };

  // LEAN MASS CALCULATOR
  const calcLean = () => {
    const p = requireProfile();

    if (!p) {
      setLeanMsg('❌ Access Denied: Enter and Save Profile first');
      return;
    }

    const storedBf = localStorage.getItem('bf');

    if (!isValid(storedBf)) {
      setLeanMsg('❌ Calculate Body Fat % first');
      return;
    }

    const leanVal =
      p.weight - (p.weight * parseFloat(storedBf) / 100);

    setLeanMsg(
      `Lean Mass: ${leanVal.toFixed(1)} kg`
    );
  };

  // CALORIES GOAL CALCULATOR
  const calcGoal = () => {
    const p = requireProfile();

    if (!p) {
      setGoalMsg('❌ Access Denied: Enter and Save Profile first');
      return;
    }

    // Always read ORIGINAL maintenance calories
    const storedBmr = localStorage.getItem('bmr');

    if (!isValid(storedBmr)) {
      setGoalMsg('❌ Calculate BMR first');
      return;
    }

    if (!isValid(rate) || parseFloat(rate) <= 0) {
      setGoalMsg('❌ Enter a valid weekly rate');
      return;
    }

    const maintenance = parseFloat(storedBmr);
    const weeklyRate = parseFloat(rate);

    const dailyCaloricShift =
      (weeklyRate * 7700) / 7;

    const targets =
      goalType === 'lose'
        ? maintenance - dailyCaloricShift
        : maintenance + dailyCaloricShift;

    if (targets <= 0) {
      setGoalMsg('❌ Invalid calorie target');
      return;
    }

    // Save goal separately - NEVER overwrite bmr
    localStorage.setItem('calorieGoal', targets);

    setGoalMsg(
      `Target: ${targets.toFixed(0)} kcal (Synced to Home Dashboard)`
    );
  };

  return (
    <section className="container">

      <h2 className="section-heading">
        Athlete Toolkit
      </h2>

      <div className="calculator-grid">

        {/* PROFILE */}
        <div className="calc-card">
          <h3>User Profile</h3>

          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Weight (kg)"
          />

          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="Height (cm)"
          />

          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Age"
          />

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <button onClick={saveProfile}>
            Save Profile
          </button>

          {profileMsg && (
            <div className="res">{profileMsg}</div>
          )}
        </div>

        {/* BMI */}
        <div className="calc-card">
          <h3>BMI</h3>

          <button onClick={calcBMI}>
            Calculate BMI
          </button>

          {bmiMsg && (
            <div className="res">{bmiMsg}</div>
          )}
        </div>

        {/* BMR */}
        <div className="calc-card">
          <h3>BMR + Maintenance</h3>

          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
          >
            <option value="">Activity Level</option>
            <option value="1.2">Sedentary</option>
            <option value="1.375">Light</option>
            <option value="1.55">Moderate</option>
            <option value="1.725">Hard</option>
            <option value="1.9">Very intense</option>
          </select>

          <button onClick={calcBMR}>
            Calculate BMR
          </button>

          {bmrMsg && (
            <div className="res">{bmrMsg}</div>
          )}
        </div>

        {/* BODY FAT */}
        <div className="calc-card">
          <h3>Body Fat %</h3>

          <input
            type="number"
            value={waist}
            onChange={(e) => setWaist(e.target.value)}
            placeholder="Waist (cm)"
          />

          <input
            type="number"
            value={neck}
            onChange={(e) => setNeck(e.target.value)}
            placeholder="Neck (cm)"
          />

          <button onClick={calcBodyFat}>
            Calculate
          </button>

          {fatMsg && (
            <div className="res">{fatMsg}</div>
          )}
        </div>

        {/* LEAN MASS */}
        <div className="calc-card">
          <h3>Lean Mass</h3>

          <button onClick={calcLean}>
            Calculate Lean Mass
          </button>

          {leanMsg && (
            <div className="res">{leanMsg}</div>
          )}
        </div>

        {/* CALORIES GOAL */}
        <div className="calc-card">
          <h3>Calories Goal</h3>

          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="Kg per week"
          />

          <select
            value={goalType}
            onChange={(e) => setGoalType(e.target.value)}
          >
            <option value="lose">Lose</option>
            <option value="gain">Gain</option>
          </select>

          <button onClick={calcGoal}>
            Calculate
          </button>

          {goalMsg && (
            <div className="res">{goalMsg}</div>
          )}
        </div>

      </div>
    </section>
  );
}

export default Nutrition;
