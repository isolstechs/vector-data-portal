import { CountryModel } from '../model/country.model';
import { OperatorModel } from '../model/operator.model';
import { Countries } from './countries';
import { Operators } from './temp-operators';

export const seed = async () => {
  let operators: any = Operators;

  const countries = await CountryModel.bulkCreate(Countries);
  countries.forEach((_c) => {
    const tempOperators = operators.filter((_o) =>
      _o.prefix.slice(0, _c.prefix.length).includes(_c.prefix),
    );
    tempOperators.map((_to) => {
      if (!_to.countryId) {
        _to.countryId = _c.id;
      }
    });
  });

  await OperatorModel.bulkCreate(operators.slice(0, 20000));
  await OperatorModel.bulkCreate(operators.slice(20001, 40000));
  await OperatorModel.bulkCreate(operators.slice(40001, 55580));
};
