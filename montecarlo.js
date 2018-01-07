// will implement both off-policy and on-policy methods
// for the Racetrack problem presented in Introduction To Reinforcement Learning (Sutton))
// the actions are the increments to the various components of velocity (9 total)
// the velocity here determines next states
// have to make sure that there's only one startSqr or start at a random start square
// might have to invert velocity since up one is x - 1 (0,0 in the top left corner of the canvas)

let actions = [[0,0],[1,1],[-1,-1],[1,0],[0,1],[1,-1],[-1,1],[-1,0],[0,-1]]

// let trackSqrs = Object.values(squares)
// let startSqrs = Object.values(start)
// let finishSqrs = Object.values(finish)
// 
// let states = startSqrs.concat(trackSqrs).concat(finishSqrs)

let serializeState = function(s) {
    return s.x + "&" + s.y
}

let Car = function(pos) {
    let velocity = {
        x: 0,
        y: 0
    }
    let position = {
        x: pos.x,
        y: pos.y
    }
    let c = {
        getVelocity: function() {
            return velocity
        },
        getPosition: function() {
            return position
        },
        getReward: function() {
            // have we tried to head off the track?
            // if not then rewards(s, a).push(-1)
            // else rewards(s,a).push(-5)
        },
        updateVelocity: function(unit) {
            velocity.x += unit[0] * cellW
            velocity.y += unit[1] * cellH

            if(velocity.y > 0) velocity.y -= 1 * cellH
            if(velocity.x < 0) velocity.x += 1 * cellW// only right turns

            // clamp both components to be less than or equal to five
            if(velocity.y < -5 * cellH) velocity.y += 1 * cellH
            if(velocity.x > 5 * cellW) velocity.x -= 1 * cellW
        },
        step: function() {
            // this function will consider the present velocity
            // but only update to valid positions (positions on the track)
            
            // let p = this.getPosition()
            // let v = c.getVelocity()
            
            let hypoPos = {
                x: position.x + velocity.x,
                y: position.y + velocity.y   
            
            }
            if(!this.onTrack(hypoPos)){
                // move in one of three directions
                let hp1 = {
                    x: position.x + velocity.x,
                    y: position.y
                }
                let hp2 = {
                    x: position.x,
                    y: position.y + velocity.y
                }
                if(this.onTrack(hp1)){
                    position.x += velocity.x
                } else if(this.onTrack(hp2)){
                    position.y += velocity.y 
                } else {
                    // try each of the three directions inc by 1
                    let h1 = position
                    let h2 = position
                    let h3 = position

                    h1.x += 1 * cellW
                    h2.x -= 1 * cellW
                    h3.y += 1 * cellH

                    if(this.onTrack(h1)) {
                        position = h1
                    } else if(this.onTrack(h2)) {
                        position = h2
                    } else if(this.onTrack(h3)) {
                        position = h3
                    }
                }
            } else {
                position = hypoPos
            }
            
            return position 
        },
        atFinish: function() {
            let p = this.getPosition()
            
            // return whether or not we've arrived at the finish 
            let result = Object.values(finish).reduce((acc, cv) => {
                return acc || (cv.x == p.x && cv.y == p.y)
            }, false)
            return result
        },
        onTrack: function(pos) {
            return squares[serializeState(pos)] != undefined || start[serializeState(pos)] != undefined || finish[serializeState(pos)] != undefined
        }
    }

    return c
}

let Q = function(){
    // let trackSqrs = Object.values(squares)
    // let startSqrs = Object.values(start)
    // let finishSqrs = Object.values(finish)

    // let states = startSqrs.concat(trackSqrs).concat(finishSqrs)
    // let actions = [-1, 0, 1] // various increments to velocity

    let serializeState = function(s) {
        return s.x + "&" + s.y
    }

    let initializeQ = function(){
        let q = {}
        for(i in states) {
            q[serializeState(states[i])] = []            
            for(ind in actions) q[serializeState(states[i])].push(0)
        }
        return q
    }

    return initializeQ()
}

let Returns = function() {
    // let trackSqrs = Object.values(squares)
    // let startSqrs = Object.values(start)
    // let finishSqrs = Object.values(finish)

    // let states = startSqrs.concat(trackSqrs).concat(finishSqrs)

    let serializeState = function(s) {
        return s.x + "&" + s.y
    }

    let initializeReturns = function() {
        let r = {}
        for(i in states) {
            r[serializeState(states[i])] = []
            for(ind in actions) r[serializeState(states[i])].push([])   
        }
        return r
    }

    return initializeReturns()
}

// for on-policy control, arbitrarily init an e-soft (p(s,a) > 0 for all (s,a))
let Policy = function() { 

    let states = Object.values(squares).concat(Object.values(finish)).concat(Object.values(start))    

    let initializePolicy = function() {
        let p = {}
        for(i in states) {
            p[serializeState(states[i])] = []
            for(ind in actions) p[serializeState(states[i])].push(1/actions.length)
        }
        return p
    }

    return initializePolicy()
}

let getMaxAction = function(s) {
    console.log("Action array is: ", s)
    let m = s.reduce((acc, cv) => Math.max(acc, cv))
    return s.indexOf(m)
}

let generateEpisode = function(policy) {
    // generate a sequence of states and actions from the policy
    let pos = Object.values(start)[0]
    let c = Car(pos)
    let pairs = []
    while(true) {
        console.log("Current pos is: ", JSON.stringify(pos))
        let action = getMaxAction(policy[serializeState(pos)])
        // see the result of hypothetically applying the action
        // if it would take you off the track, then don't do it (do inc so that you stay on the track) 
        // else then take the action
        // let c.updateVelocity(action)

        pairs.push([pos, action])
        console.log("Max action is: ", action)
        console.log("Current action, is: ", actions[action])  
        c.updateVelocity(actions[action])
        pos = c.step()         
        console.log("Pos after step: ", JSON.stringify(pos))
        console.log("New action set: ", policy[serializeState(pos)].toString())
        // check if we're done
        if(c.atFinish()) break
    }

    return pairs
}

let onPolicy = function() {
    // init policy
    // init action values
    // init returns
    // let returnsForEpisode = {} // a dictionary that maps to arrays(actions) 
    // you have to keep track of what (state, action) you've seen before

    // repeat forever (?)
    // generate episode using policy
    // for all (s,a) in episode
        //  r <- first occurence reward for (s,a)
        //  R(s,a).append(r)
        //  Q(s,a) = mean(R(s,a))
    // foreach s in the episode, policy improve with e-greedy
    
}

