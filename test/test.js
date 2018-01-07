
let testTrack = {"start":[{"x":190,"y":330,"color":"rgb(10, 255, 10)"}],"finish":[{"x":230,"y":220,"color":"rgb(255, 0, 0)"}],"track":[{"x":190,"y":320,"color":"rgb(0, 0, 0)"},{"x":190,"y":310,"color":"rgb(0, 0, 0)"},{"x":190,"y":300,"color":"rgb(0, 0, 0)"},{"x":190,"y":290,"color":"rgb(0, 0, 0)"},{"x":190,"y":280,"color":"rgb(0, 0, 0)"},{"x":190,"y":270,"color":"rgb(0, 0, 0)"},{"x":190,"y":260,"color":"rgb(0, 0, 0)"},{"x":190,"y":250,"color":"rgb(0, 0, 0)"},{"x":190,"y":240,"color":"rgb(0, 0, 0)"},{"x":190,"y":230,"color":"rgb(0, 0, 0)"},{"x":190,"y":220,"color":"rgb(0, 0, 0)"},{"x":200,"y":220,"color":"rgb(0, 0, 0)"},{"x":210,"y":220,"color":"rgb(0, 0, 0)"},{"x":220,"y":220,"color":"rgb(0, 0, 0)"}]}

describe('Montecarlo.js', function() {
    describe("#updateVelocity", function(){
        let c = Car({
            x: 100,
            y: 100
        })
        it("should equal {x: 10, y: 0} then {x: 0, y: -10}", function() {
            
            c.updateVelocity([1,1])
            expect(c.getVelocity()).to.eql({
                x: 10,
                y: 0
            })
            c.updateVelocity([-1, -1])
            expect(c.getVelocity()).to.eql({
                x: 0,
                y: -10
            }) 

        })
    })
    describe("#onTrack", function(){
        loadTrack(testTrack)
        let c = Car(testTrack["start"][0])
        it("should be true", function(){
            expect(c.onTrack({
                x: 230,
                y: 220
            })).to.be.ok()
        })
        it("should be false", function(){
            expect(c.onTrack({
                x: 280,
                y: 330
            })).to.not.be.ok()
        })
    })
    describe("#step", function() { 
        loadTrack(testTrack) 
        it("position should equal {x: 190, y: 330}", function(){
            
            let c = Car(testTrack["start"][0])
            c.updateVelocity([1,1])
            c.step()

            expect(c.getPosition()).to.eql({
                x: 190,
                y: 330
            })
        })
        it("position should equal {x: 190, y: 320}", function(){
            let c = Car(testTrack["start"][0])
            c.updateVelocity([-1, -1])
            c.step()

            expect(c.getPosition()).to.eql({
                x: 190,
                y: 320
            })
        })
    })
})

