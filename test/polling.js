import { expect } from 'chai'
import { durationToSeconds } from '../src/polling'

describe('polling', () => {
  describe('durationToSeconds', () => {
    it('understands a single second', () => {
      expect(durationToSeconds('second')).to.equal(1)
    })

    it('understands a single minute', () => {
      expect(durationToSeconds('minute')).to.equal(60)
    })

    it('understands a single hour', () => {
      expect(durationToSeconds('hour')).to.equal(60 * 60)
    })

    it('understands seconds', () => {
      expect(durationToSeconds('5 seconds')).to.equal(5)
    })

    it('understands minutes', () => {
      expect(durationToSeconds('5 minutes')).to.equal(5 * 60)
    })

    it('understands hours', () => {
      expect(durationToSeconds('5 hours')).to.equal(5 * 60 * 60)
    })

    it('returns null for unknown durations', () => {
      expect(durationToSeconds('foo')).to.equal(null)
    })
  })
})
