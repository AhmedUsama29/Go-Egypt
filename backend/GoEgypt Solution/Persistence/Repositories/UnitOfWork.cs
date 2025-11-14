using Domain.Contracs;
using Domain.Contracts;
using Domain.Models;
using Persistence.Data;
using Persistence.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Persistence.Repositories
{
    public class UnitOfWork(GoEgyptIdentityDbContext _dbContext, GoEgyptDbContext _egyDBContext) : IUnitOfWork
    {

        private readonly Dictionary<string, object> _repositories = [];
        public IGenericRepository<TEntity, TKey> GetRepository<TEntity, TKey>() where TEntity : class
        {

            var typeName = typeof(TEntity).Name;
            if (_repositories.ContainsKey(typeName))
                return (GenericRepository<TEntity, TKey>) _repositories[typeName];


            var repo = new GenericRepository<TEntity, TKey>(_dbContext, _egyDBContext);

            _repositories[typeName] = repo;

            return repo;
        }

        public async Task<int> SaveChanges()
        {
            return await _dbContext.SaveChangesAsync();
        }
        public async Task<int> SaveChangesAppDb()
        {
            return await _egyDBContext.SaveChangesAsync();
        }
    }
}
