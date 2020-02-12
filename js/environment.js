const Environment = function(radius, agentCount, mutator = null) {
    this.mutator = mutator;
    this.radius = radius;
    this.agentCount = agentCount;
    this.agents = [];

    this.nextGeneration();
};

Environment.SPAWN_INSET = 128;

Environment.prototype.update = function(timeStep) {
    const radiusSquared = this.radius * this.radius;

    for (let i = this.agents.length; i-- > 0;) {
        this.agents[i].update(timeStep);

        if (this.agents[i].position.dot(this.agents[i].position) > radiusSquared)
            this.agents.splice(i, 1);
    }

    if (this.agents.length === 0)
        this.nextGeneration();
};

Environment.prototype.draw = function(context) {
    const gradient = context.createRadialGradient(0, 0, this.radius * .1, 0, 0, this.radius);

    gradient.addColorStop(0, "#4b4b4b");
    gradient.addColorStop(1, "#343434");

    context.strokeStyle = "white";
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();

    for (const agent of this.agents)
        agent.draw(context);
};

Environment.prototype.nextGeneration = function() {
    this.agents.length = 0;

    // TODO: Use mutator

    this.initialize(this.agentCount);
};

Environment.prototype.initialize = function(agentCount) {
    for (let agent = 0; agent < agentCount; ++agent) {
        const angle = agent * Math.PI * 2 / agentCount;

        this.agents.push(new Agent(
            new Vector().fromAngle(angle + Math.PI).multiply(this.radius - Environment.SPAWN_INSET),
            new Vector().fromAngle(angle)));
    }
};