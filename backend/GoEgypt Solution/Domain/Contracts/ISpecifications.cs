using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Contracts
{
    public interface ISpecifications<T> where T : class
    {
        public Expression<Func<T, bool>> Criteria { get;} // filtering
        public List<Expression<Func<T, object>>> IncludeExpressions { get;}
        public bool IsPagingEnabled { get; } //For Pagination

        public int Skip { get; }
        public int Take { get; }



    }
}
