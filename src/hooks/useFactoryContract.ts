import { useWriteContract } from 'wagmi'
import { FACTORY_CONTRACT_ABI, FACTORY_CONTRACT_ADDRESS } from '../contracts-abi'

export function useFactoryContract() {
  const { data: hash, writeContract } = useWriteContract()
  const createNewGame = async (player1: string, player2: string) => {
    writeContract({
      address: FACTORY_CONTRACT_ADDRESS,
      abi: FACTORY_CONTRACT_ABI,
      functionName: 'createGame',
      args: [player1, player2],
    })

    console.log('message called')
  }

  return {
    hash,
    createNewGame,
  }
}
