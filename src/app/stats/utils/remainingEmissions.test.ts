import { add, sub } from "date-fns"
import {
  AUG_1_2023,
  getDailyEmisisons,
  getLatestSubNetworkEmissions,
  getRemainingEmissions,
} from "./remainingEmissions"
import subNetworkEmissions from "./subNetworkEmissions.json"

describe("getRemaingEmissions", () => {
  describe("hnt", () => {
    const HNT_YEARLY = 15000000
    const HNT_EMISSIONS_REMAING = HNT_YEARLY * 4

    it("returns remaining emissions on Aug 1st, 2024", () => {
      const dayOf = add(AUG_1_2023, { hours: 1 })
      expect(getRemainingEmissions(dayOf, "hnt")).toEqual(HNT_EMISSIONS_REMAING)
    })

    it("adds emissions when before Aug 1st, 2024", () => {
      const twoDaysBefore = sub(AUG_1_2023, { days: 1, hours: 6 })
      expect(getRemainingEmissions(twoDaysBefore, "hnt")).toEqual(
        HNT_EMISSIONS_REMAING + ((HNT_YEARLY * 2) / 365) * 2
      )
    })

    describe("when after after Aug 1st, 2024", () => {
      it("subtracts emissions in a leap year", () => {
        const nextDay = add(AUG_1_2023, { days: 1, hours: 1 })
        expect(getRemainingEmissions(nextDay, "hnt")).toEqual(
          HNT_EMISSIONS_REMAING - HNT_YEARLY / 366
        )

        const almostYear = add(AUG_1_2023, { days: 365, hours: 1 })
        expect(getRemainingEmissions(almostYear, "hnt")).toEqual(
          HNT_EMISSIONS_REMAING - (HNT_YEARLY / 366) * 365
        )
      })

      it("subtracts emissions in a none leap year", () => {
        const postLeapYear = add(AUG_1_2023, { years: 1, days: 1, hours: 1 })
        expect(getRemainingEmissions(postLeapYear, "hnt")).toEqual(
          HNT_EMISSIONS_REMAING - HNT_YEARLY - HNT_YEARLY / 365
        )
      })

      it("returns remaining emissions from 2025 halvening", () => {
        const atHalvening2025 = add(AUG_1_2023, { years: 2, hours: 1 })
        expect(getRemainingEmissions(atHalvening2025, "hnt")).toEqual(
          HNT_EMISSIONS_REMAING - HNT_YEARLY * 2
        )
      })

      it("subtracts emissions after next halvening", () => {
        const dayAfterHalvening2025 = add(AUG_1_2023, {
          years: 2,
          days: 1,
          hours: 1,
        })
        expect(getRemainingEmissions(dayAfterHalvening2025, "hnt")).toEqual(
          HNT_EMISSIONS_REMAING - HNT_YEARLY * 2 - HNT_YEARLY / 2 / 365
        )
      })

      it("subtracts emissions for the following leap year", () => {
        const dayAfterHalvening2027 = add(AUG_1_2023, {
          years: 4,
          days: 1,
          hours: 1,
        })
        expect(getRemainingEmissions(dayAfterHalvening2027, "hnt")).toEqual(
          HNT_EMISSIONS_REMAING -
            HNT_YEARLY * 2 - // 2023 + 2024
            (HNT_YEARLY / 2) * 2 - // 2025 + 2026
            HNT_YEARLY / 4 / 366 // one day into next leap year
        )
      })
    })
  })

  describe("mobile", () => {
    it("has the same behavior for mobile", () => {
      const MOBILE_YEARLY = 30000000000
      const MOBILE_EMISSIONS_REMAINING = MOBILE_YEARLY * 4
      const dayOf = add(AUG_1_2023, { hours: 1 })
      expect(getRemainingEmissions(dayOf, "mobile")).toEqual(
        MOBILE_EMISSIONS_REMAINING
      )
      const twoDaysBefore = sub(AUG_1_2023, { days: 1, hours: 6 })
      expect(getRemainingEmissions(twoDaysBefore, "mobile")).toEqual(
        MOBILE_EMISSIONS_REMAINING + ((MOBILE_YEARLY * 2) / 365) * 2
      )

      const nextDay = add(AUG_1_2023, { days: 1, hours: 1 })
      expect(getRemainingEmissions(nextDay, "mobile")).toEqual(
        MOBILE_EMISSIONS_REMAINING - MOBILE_YEARLY / 366
      )

      const almostYear = add(AUG_1_2023, { days: 365, hours: 1 })
      expect(getRemainingEmissions(almostYear, "mobile")).toEqual(
        MOBILE_EMISSIONS_REMAINING - (MOBILE_YEARLY / 366) * 365
      )

      const postLeapYear = add(AUG_1_2023, { years: 1, days: 1, hours: 1 })
      expect(getRemainingEmissions(postLeapYear, "mobile")).toEqual(
        MOBILE_EMISSIONS_REMAINING - MOBILE_YEARLY - MOBILE_YEARLY / 365
      )

      const atHalvening2026 = add(AUG_1_2023, { years: 2, hours: 1 })
      expect(getRemainingEmissions(atHalvening2026, "mobile")).toEqual(
        MOBILE_EMISSIONS_REMAINING - MOBILE_YEARLY * 2
      )

      const dayAfterHalvening2025 = add(AUG_1_2023, {
        years: 2,
        days: 1,
        hours: 1,
      })
      expect(getRemainingEmissions(dayAfterHalvening2025, "mobile")).toEqual(
        MOBILE_EMISSIONS_REMAINING - MOBILE_YEARLY * 2 - MOBILE_YEARLY / 2 / 365
      )

      const dayAfterHalvening2027 = add(AUG_1_2023, {
        years: 4,
        days: 1,
        hours: 1,
      })
      expect(getRemainingEmissions(dayAfterHalvening2027, "mobile")).toEqual(
        MOBILE_EMISSIONS_REMAINING -
          MOBILE_YEARLY * 2 - // 2023 + 2024
          (MOBILE_YEARLY / 2) * 2 - // 2025 + 2026
          MOBILE_YEARLY / 4 / 366 // one day into next leap year
      )
    })
  })

  describe("iot", () => {
    it("has the same behavior for iot", () => {
      const IOT_YEARLY = 32500000000
      const IOT_EMISSIONS_REMAINING = IOT_YEARLY * 4
      const dayOf = add(AUG_1_2023, { hours: 1 })
      expect(getRemainingEmissions(dayOf, "iot")).toEqual(
        IOT_EMISSIONS_REMAINING
      )
      const twoDaysBefore = sub(AUG_1_2023, { days: 1, hours: 6 })
      expect(getRemainingEmissions(twoDaysBefore, "iot")).toEqual(
        IOT_EMISSIONS_REMAINING + ((IOT_YEARLY * 2) / 365) * 2
      )

      const nextDay = add(AUG_1_2023, { days: 1, hours: 1 })
      expect(getRemainingEmissions(nextDay, "iot")).toEqual(
        IOT_EMISSIONS_REMAINING - IOT_YEARLY / 366
      )

      const almostYear = add(AUG_1_2023, { days: 365, hours: 1 })
      expect(getRemainingEmissions(almostYear, "iot")).toEqual(
        IOT_EMISSIONS_REMAINING - (IOT_YEARLY / 366) * 365
      )

      const postLeapYear = add(AUG_1_2023, { years: 1, days: 1, hours: 1 })
      expect(getRemainingEmissions(postLeapYear, "iot")).toEqual(
        IOT_EMISSIONS_REMAINING - IOT_YEARLY - IOT_YEARLY / 365
      )

      const atHalvening2026 = add(AUG_1_2023, { years: 2, hours: 1 })
      expect(getRemainingEmissions(atHalvening2026, "iot")).toEqual(
        IOT_EMISSIONS_REMAINING - IOT_YEARLY * 2
      )

      const dayAfterHalvening2025 = add(AUG_1_2023, {
        years: 2,
        days: 1,
        hours: 1,
      })
      expect(getRemainingEmissions(dayAfterHalvening2025, "iot")).toEqual(
        IOT_EMISSIONS_REMAINING - IOT_YEARLY * 2 - IOT_YEARLY / 2 / 365
      )

      const dayAfterHalvening2027 = add(AUG_1_2023, {
        years: 4,
        days: 1,
        hours: 1,
      })
      expect(getRemainingEmissions(dayAfterHalvening2027, "iot")).toEqual(
        IOT_EMISSIONS_REMAINING -
          IOT_YEARLY * 2 - // 2023 + 2024
          (IOT_YEARLY / 2) * 2 - // 2025 + 2026
          IOT_YEARLY / 4 / 366 // one day into next leap year
      )
    })
  })

  describe("getDailyEmissions helper", () => {
    const after2023 = add(AUG_1_2023, { days: 1 }) // leap year
    const after2024 = add(AUG_1_2023, { days: 1, years: 1 }) // non-leap
    const after2025 = add(AUG_1_2023, { days: 1, years: 2 })

    it("returns the correct values for HNT", () => {
      const yearlyEmissions = 15000000

      expect(getDailyEmisisons(after2023, "hnt")).toBe(yearlyEmissions / 366)
      expect(getDailyEmisisons(after2024, "hnt")).toBe(yearlyEmissions / 365)
      expect(getDailyEmisisons(after2025, "hnt")).toBe(
        yearlyEmissions / 365 / 2
      )
    })

    it("returns the correct values for IOT", () => {
      const yearlyEmissions = 32500000000

      expect(getDailyEmisisons(after2023, "iot")).toBe(yearlyEmissions / 366)
      expect(getDailyEmisisons(after2024, "iot")).toBe(yearlyEmissions / 365)
      expect(getDailyEmisisons(after2025, "iot")).toBe(
        yearlyEmissions / 365 / 2
      )
    })

    it("returns the correct values for MOBILE", () => {
      const yearlyEmissions = 30000000000

      expect(getDailyEmisisons(after2023, "mobile")).toBe(yearlyEmissions / 366)
      expect(getDailyEmisisons(after2024, "mobile")).toBe(yearlyEmissions / 365)
      expect(getDailyEmisisons(after2025, "mobile")).toBe(
        yearlyEmissions / 365 / 2
      )
    })
  })

  describe("getLatestSubNetworkEmissions", () => {
    it("returns the correct values for IOT", () => {
      const before2023 = sub(AUG_1_2023, { days: 1 })
      const after2023 = add(AUG_1_2023, { days: 1, hours: 1 }) // leap year
      const after2024 = add(AUG_1_2023, { days: 1, years: 1, hours: 1 }) // non-leap
      expect(getLatestSubNetworkEmissions(before2023, "iot")).toBe(
        subNetworkEmissions.iot[0].emissionsPerEpoch
      )
      expect(getLatestSubNetworkEmissions(after2023, "iot")).toBe(
        subNetworkEmissions.iot[1].emissionsPerEpoch
      )
      expect(getLatestSubNetworkEmissions(after2024, "iot")).toBe(
        subNetworkEmissions.iot[2].emissionsPerEpoch
      )
    })

    it("returns the correct values for MOBILE", () => {
      const weekBefore2023 = sub(AUG_1_2023, { days: 7 })
      const catchupDay = sub(AUG_1_2023, { days: 2, hours: 23 })
      const before2023 = sub(AUG_1_2023, { days: 1 })
      const after2023 = add(AUG_1_2023, { days: 1, hours: 1 }) // leap year
      const after2024 = add(AUG_1_2023, { days: 1, years: 1, hours: 1 }) // non-leap

      expect(getLatestSubNetworkEmissions(weekBefore2023, "mobile")).toBe(
        subNetworkEmissions.mobile[0].emissionsPerEpoch
      )
      expect(getLatestSubNetworkEmissions(catchupDay, "mobile")).toBe(
        subNetworkEmissions.mobile[1].emissionsPerEpoch
      )
      expect(getLatestSubNetworkEmissions(before2023, "mobile")).toBe(
        subNetworkEmissions.mobile[2].emissionsPerEpoch
      )
      expect(getLatestSubNetworkEmissions(after2023, "mobile")).toBe(
        subNetworkEmissions.mobile[3].emissionsPerEpoch
      )
      expect(getLatestSubNetworkEmissions(after2024, "mobile")).toBe(
        subNetworkEmissions.mobile[4].emissionsPerEpoch
      )
    })
  })
})
