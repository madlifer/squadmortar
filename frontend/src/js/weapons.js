import { App } from "./conf";

export class Weapon {
    constructor(name, initialVelocity, deceleration, decelerationTime, gravityScale, minElevation, unit, logo, marker, logoCannonPos, type, angleType, elevationPrecision, minDistance, moa, maxDamage, startRadius, endRadius, falloff) {
        this.name = name;
        this.initialVelocity = initialVelocity;
        this.deceleration = deceleration;
        this.decelerationTime = decelerationTime;
        this.gravityScale = gravityScale;
        this.minElevation = minElevation;
        this.unit = unit;
        this.logo = logo;
        this.marker = marker;
        this.logoCannonPos = logoCannonPos;
        this.type = type;
        this.angleType = angleType;
        this.elevationPrecision = elevationPrecision;
        this.minDistance = minDistance;
        this.moa = moa;
        this.maxDistance = this.getMaxDistance();
        this.hundredDamageRadius = this.calculateDistanceForDamage(maxDamage, startRadius, endRadius, falloff, 100);
        this.twentyFiveDamageRadius = this.calculateDistanceForDamage(maxDamage, startRadius, endRadius, falloff, 25);
    }

    /**
       * Return the weapon velocity
       * @param {number} } [distance] - distance between mortar and target from getDist()
       * @returns {number} - Velocity of the weapon for said distance
    */

    
getVelocity(distance) {
    if (this.deceleration === 0 || this.decelerationTime === 0) {
        return this.initialVelocity;
    }
    const acceleration = -this.decelerationTime 
    // Calculate the distance traveled during deceleration
    const decelerationDistance = this.initialVelocity * acceleration +
        0.5 * this.deceleration * Math.pow(acceleration, 2);

    if (distance <= decelerationDistance) {
        // The projectile is still in the deceleration phase
        const t = Math.sqrt((2 * distance) /
            (2 * this.initialVelocity + this.deceleration * acceleration));
        return this.initialVelocity + this.deceleration * t;
    } else {
        // The projectile has finished decelerating
        const finalVelocity = this.initialVelocity + this.deceleration * acceleration;
        const timeAfterDeceleration = (distance - decelerationDistance) / finalVelocity;
        const totalTime = acceleration + timeAfterDeceleration;
        let retura = distance / totalTime;
        debugger;
        // Use the projectile motion equation to calculate the average velocity
        return distance / totalTime;
    }
}

    /**
     * Return the angle factor from 45°
     * @returns {1/-1} -1 = 0-45° / 1 = 45-90°
     */
    getAngleType() {
        if (this.angleType === "high") { return -1; }
        return 1;
    }

    /**
     * Return maximum distance for 45°
     * https://en.wikipedia.org/wiki/Projectile_motion#Maximum_distance_of_projectile
     * @returns {number} [distance]
     */
    getMaxDistance() {
        return (this.initialVelocity ** 2) / App.gravity / this.gravityScale;
    }

    calculateDistanceForDamage(maxDamage, startRadius, endRadius, falloff, distanceFromImpact, targetDamage) {
        var characterSize = 1.8;
        var radius = endRadius - (Math.pow(targetDamage / maxDamage, 1 / falloff) * (endRadius - startRadius));
        return Math.sqrt(-Math.pow(distanceFromImpact - characterSize, 2) + Math.pow(radius, 2));
    }

}