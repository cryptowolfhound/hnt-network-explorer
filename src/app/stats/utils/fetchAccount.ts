import { accountCache } from "@/app/stats/utils/accountCache"
import { TypedAccountParser } from "@helium/account-fetch-cache"
import { AccountInfo, PublicKey } from "@solana/web3.js"

export interface ParsedAccountBase<T> {
  pubkey: PublicKey
  account: AccountInfo<Buffer>
  info: T
}

export interface AccountState<T> {
  account?: AccountInfo<Buffer>
  info?: T | undefined
}

/**
 * Generic fetch to get a cached, auto updating, deserialized form of any Solana account. Massively saves on RPC usage by using
 * the spl-utils accountFetchCache.
 *
 * @param key
 * @param parser
 * @param isStatic
 * @returns
 */
export async function fetchAccount<T>(
  key: null | undefined | PublicKey,
  parser: TypedAccountParser<T>,
  isStatic = false // Set if the accounts data will never change, optimisation to lower websocket usage.
): Promise<AccountState<T>> {
  const cache = accountCache

  const parsedAccountBaseParser = (
    pubkey: PublicKey,
    data: AccountInfo<Buffer>
  ): ParsedAccountBase<T> => {
    try {
      const info = parser(pubkey, data)
      return {
        pubkey,
        account: data,
        info,
      }
    } catch (e) {
      console.error(`Error while parsing: ${(e as Error).message}`)
      throw e
    }
  }

  const id = typeof key === "string" ? key : key?.toBase58()

  return await new Promise<AccountState<T>>((resolve, reject) => {
    if (!id || !cache) {
      return reject("No pubkey or cache")
    }
    return cache.search(id, parsedAccountBaseParser, isStatic).then((acc) => {
      if (acc) {
        try {
          const nextInfo = parser && parser(acc.pubkey, acc?.account)
          resolve({
            info: nextInfo,
            account: acc.account,
          })
        } catch (e) {
          return reject(`Error while parsing: ${(e as Error).message}`)
        }
      } else {
        return reject("No account")
      }
    })
  }).then((result) => {
    if (!result.info) throw new Error("No info")
    return result
  })
}
