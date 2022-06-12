function boxMullerTransform() {
    const u1 = Math.random();
    const u2 = Math.random();
    
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    
    return { z0};
}

export function randomNorm(mean, stddev) {
    const { z0 } = boxMullerTransform();
    return z0 * stddev + mean;
}

export function randomUnif(mean, stddev){
    const max = mean + 1.73 * stddev;
    const min = mean - 1.73 * stddev;
    return Math.random() * (max - min) + min;
}

export function randomTri(mean, stddev){
    const max = (mean + 1.73 * stddev)/2;
    const min = (mean - 1.73 * stddev)/2;

    const rand1 = Math.random() * (max - min) + min;
    const rand2 = Math.random() * (max - min) + min;
    return rand1 + rand2; 
}