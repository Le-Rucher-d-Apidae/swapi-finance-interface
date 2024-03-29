import { ChainId, JSBI, Token, TokenAmount } from '@swapi-finance/sdk'
import { BigNumber } from 'ethers'
import { ZERO_ADDRESS } from '../constants'
import { computeSelfTokenCirculation } from './computeSelfTokenCirculation'

describe('computeSelfTokenCirculation', () => {
	const token = new Token(ChainId.AVALANCHE, ZERO_ADDRESS, 18)

	function expandTo18Decimals(num: JSBI | string | number) {
		return JSBI.multiply(JSBI.BigInt(num), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18)))
	}

	function tokenAmount(num: JSBI | string | number) {
		return new TokenAmount(token, expandTo18Decimals(num))
	}

	expect(computeSelfTokenCirculation(token, BigNumber.from(0), undefined)).toEqual(tokenAmount(1_000_000_000))
})
