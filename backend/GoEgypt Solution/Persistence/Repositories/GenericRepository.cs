using Domain.Contracs;
using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Persistence.Data; // لازم تعمل using لده
using Persistence.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Persistence.Repositories
{
    public class GenericRepository<TEntity, TKey>(GoEgyptIdentityDbContext _dbContext, GoEgyptDbContext _egyDbContext) : IGenericRepository<TEntity, TKey>
                                              where TEntity : class
    {

        public void Add(TEntity entity)
        {
            _dbContext.Set<TEntity>().Add(entity);
        }

        public void Update(TEntity entity)
        {
            _dbContext.Set<TEntity>().Update(entity);
        }

        public void Delete(TEntity entity)
        {
            _dbContext.Set<TEntity>().Remove(entity);
        }

        public async Task<IEnumerable<TEntity>> GetAllAsync()
        {
            return await _dbContext.Set<TEntity>().ToListAsync();
        }

        public async Task<TEntity?> GetByIdAsync(TKey id)
        {
            return await _dbContext.Set<TEntity>().FindAsync(id);
        }


        public void AddAppDb(TEntity entity)
        {
            _egyDbContext.Set<TEntity>().Add(entity);
        }

        public void UpdateAppDb(TEntity entity)
        {
            _egyDbContext.Set<TEntity>().Update(entity);
        }

        public void DeleteAppDb(TEntity entity)
        {
            _egyDbContext.Set<TEntity>().Remove(entity);
        }

        public IQueryable<TEntity> GetAllAppDbAsync()
        {
            return _egyDbContext.Set<TEntity>();
        }

        public async Task<TEntity?> GetByIdAppDbAsync(TKey id)
        {
            return await _egyDbContext.Set<TEntity>().FindAsync(id);
        }

    }
}