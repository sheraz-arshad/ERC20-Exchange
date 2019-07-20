import web3 from './web3';
import ABI_Exchange from './ABI_Exchange'
import config from '../config';

const Exchange_Instance = new web3.eth.Contract(ABI_Exchange, config.address_Exchange);

export default Exchange_Instance;