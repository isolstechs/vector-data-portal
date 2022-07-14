// import { UpdatedCodeList } from './updated-codes-list';
// import { CountryModel } from '../model/country.model';
// import { OperatorModel } from '../model/operator.model';
// import { PrefixModel } from '../model/prefix.model';
// import * as _ from 'lodash';
// import { ICountry } from 'server/modules/interfaces/country.interface';
// import { IPrefix } from 'server/modules/interfaces/prefix.interface';
// import { IOperator } from 'server/modules/interfaces/operator.interface';
// import { countryList } from '../../../modules/home/country-list';
// import { IPrefixList } from 'server/modules/interfaces/prefix-list.interface';

export const seed = async () => {
  // let promiseArray = [];
  // let updatedCodeList: any = UpdatedCodeList;
  // let countries = [];
  // let operators = [];
  // let prefix = [];
  // Separating countries and operators
  // updatedCodeList.forEach((_ucl: IPrefixList) => {
  //   if (_ucl.country == _ucl.operator) {
  //     countries.push({
  //       name: _ucl.country,
  //       numericCode: _ucl.prefix,
  //       alphaCode: countryList.find((_c) => _c.name == _ucl.country)?.code,
  //     });
  //   } else {
  //     operators.push({ name: _ucl.operator });
  //   }
  // });
  // operators = _.sortBy(_.uniqBy(operators, 'name'), 'name');
  // countries = _.sortBy(_.uniqBy(countries, 'name'), 'name');
  // // getting countries and operators with ids
  // countries = await CountryModel.bulkCreate(countries);
  // operators = await OperatorModel.bulkCreate(operators);
  // // saving prefix
  // updatedCodeList.forEach((_ucl: IPrefixList) => {
  //   if (_ucl.country != _ucl.operator) {
  //     const country = countries.find((_c: ICountry) => _c.name == _ucl.country);
  //     const operator = operators.find(
  //       (_c: IOperator) => _c.name == _ucl.operator
  //     );
  //     prefix.push({
  //       code: _ucl.prefix,
  //       countryId: country?.id,
  //       operatorId: operator?.id,
  //     });
  //   }
  // });
  // promiseArray.push(PrefixModel.bulkCreate(prefix.slice(0, 20000)));
  // promiseArray.push(PrefixModel.bulkCreate(prefix.slice(20001, 40000)));
  // promiseArray.push(PrefixModel.bulkCreate(prefix.slice(40001)));
  // await Promise.all(promiseArray);
  // for checking prefix
  // const tempSrilanka = updatedCodeList.filter(
  //   (_ucl) => _ucl.country == 'Sri Lanka'
  // );
  // countries = _.remove(tempSrilanka, function (n) {
  //   return sriLanka.find((_s) => n.prefix == _s.prefix);
  // });
  // console.log(countries, countries.length, tempSrilanka);
};
