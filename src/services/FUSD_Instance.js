import web3 from './web3';
import ABI_FUSD from './ABI_FUSD'
import config from '../config';

const FUSD_Instance = new web3.eth.Contract(ABI_FUSD, config.address_FUSD);

export default FUSD_Instance;