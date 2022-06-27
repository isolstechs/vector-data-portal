import { UpdatedCodeList } from './updated-codes-list';
import { CountryModel } from '../model/country.model';
import { OperatorModel } from '../model/operator.model';
import { PrefixModel } from '../model/prefix.model';
import * as _ from 'lodash';

export const seed = async () => {
  let promiseArray = [];
  let updatedCodeList: any = UpdatedCodeList;
  let countries = [];
  let operators = [];
  let prefix = [];

  // Separating countries and operators
  updatedCodeList.forEach((_ucl) => {
    if (_ucl.country == _ucl.operator) {
      countries.push({ name: _ucl.country, code: _ucl.prefix });
    } else {
      operators.push({ name: _ucl.operator });
    }
  });

  operators = _.sortBy(_.uniqBy(operators, 'name'), 'name');
  countries = _.sortBy(_.uniqBy(countries, 'name'), 'name');

  // getting countries and operators with ids
  countries = await CountryModel.bulkCreate(countries);
  operators = await OperatorModel.bulkCreate(operators);

  // saving prefix
  updatedCodeList.forEach((_ucl) => {
    if (_ucl.country != _ucl.operator) {
      const country = countries.find((_c) => _c.name == _ucl.country);
      const operator = operators.find((_c) => _c.name == _ucl.operator);
      prefix.push({
        code: _ucl.prefix,
        countryId: country?.id,
        operatorId: operator?.id,
      });
    }
  });

  promiseArray.push(PrefixModel.bulkCreate(prefix.slice(0, 20000)));
  promiseArray.push(PrefixModel.bulkCreate(prefix.slice(20001, 40000)));
  promiseArray.push(PrefixModel.bulkCreate(prefix.slice(40001)));
  await Promise.all(promiseArray);
};
