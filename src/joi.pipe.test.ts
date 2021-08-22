import * as joi_pipe from "./joi.pipe"

// @ponicode
describe("transform", () => {
    let inst: any

    beforeEach(() => {
        inst = new joi_pipe.JoiPipe(undefined)
    })

    test("0", () => {
        let callFunction: any = () => {
            inst.transform("Dillenberg", undefined)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            inst.transform("Elio", undefined)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            inst.transform(100, undefined)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            inst.transform("elio@example.com", undefined)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            inst.transform(1, undefined)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            inst.transform(-Infinity, undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})
