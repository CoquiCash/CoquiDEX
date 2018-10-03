// @flow
import React, { PureComponent } from 'react';
import type { List } from 'immutable';
import { withStyles } from '@material-ui/core/styles';
import { getCoinIcon } from '../../../components/CryptoIcons';
import { Line, Circle } from '../../../components/placeholder';
import getConfig from '../../../utils/config';
import { covertSymbolToName, floor } from '../utils';
import CoinSelectable from './CoinSelectable';

const debug = require('debug')('dicoapp:containers:BuyPage:PaymentSection');

const config = getConfig();
const COIN_BASE = config.get('marketmaker.tokenconfig');

const line = (
  <Line
    width={60}
    style={{
      marginTop: 8
    }}
  />
);

const lineTitle = (
  <Line
    width={90}
    style={{
      margin: '5px 0px'
    }}
  />
);

const lineContent = (
  <Line
    width={90}
    style={{
      margin: 0
    }}
  />
);

const circle = (
  <Circle
    style={{
      width: 32,
      height: 32
    }}
  />
);

const styles = () => ({});

type Props = {
  loading: boolean,
  // eslint-disable-next-line flowtype/no-weak-types
  // classes: Object,
  // eslint-disable-next-line flowtype/no-weak-types
  dispatchLoadPrice: Function,
  // eslint-disable-next-line flowtype/no-weak-types
  onClick: Function,
  paymentCoin: string,
  // eslint-disable-next-line flowtype/no-weak-types
  balance: Object,
  entities: Map<*, *>,
  list: List<*>
};

class PaymentSection extends PureComponent<Props> {
  static defaultProps = {};

  renderPaymentCoin = symbol => {
    const {
      onClick,
      paymentCoin,
      entities,
      balance,
      dispatchLoadPrice
    } = this.props;
    const c = entities.get(symbol);
    const b = balance.get(symbol);
    const icon = getCoinIcon(symbol);
    const name = covertSymbolToName(symbol);
    if (!c) {
      // not found in entities
      return (
        <CoinSelectable
          dispatchLoadPrice={dispatchLoadPrice}
          disabled
          key={`paymentCoin${symbol}`}
          data={symbol}
          icon={icon}
          title={name}
          subTitle={`${floor(b.get('balance'), 3)} ${b.get('coin')}`}
        >
          {lineContent}
        </CoinSelectable>
      );
    }
    return (
      <CoinSelectable
        dispatchLoadPrice={dispatchLoadPrice}
        disabled={c.get('bestPrice') === 0 || b.get('balance') === 0}
        selected={paymentCoin === symbol}
        key={`paymentCoin${symbol}`}
        data={symbol}
        icon={icon}
        title={name}
        subTitle={`${floor(b.get('balance'), 3)} ${b.get('coin')}`}
        onClick={onClick}
      >
        <span>
          1 {COIN_BASE.coin} = {c.get('bestPrice')} {symbol}
        </span>
      </CoinSelectable>
    );
  };

  renderLoading = () => (
    <CoinSelectable icon={circle} title={lineTitle} subTitle={line}>
      {lineContent}
    </CoinSelectable>
  );

  render() {
    debug(`render`);
    const { list, loading } = this.props;
    if (loading && list.size === 0) {
      return this.renderLoading();
    }
    return list.map(this.renderPaymentCoin);
  }
}

PaymentSection.displayName = 'PaymentSection';

export default withStyles(styles)(PaymentSection);
