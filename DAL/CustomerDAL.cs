using ToyStore.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Web;

namespace ToyStore.DAL
{
    public class CustomerDAL : DbContext
    {
        public CustomerDAL() : base("DatabaseConnection") { } // Connection string name
        public DbSet<Customer> Customers { get; set; } // Define DbSet for Toy model
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Configuration.LazyLoadingEnabled = true;
            modelBuilder.Entity<Customer>().ToTable("Customer");
            base.OnModelCreating(modelBuilder);
        }

        public void Add(Customer customer)
        {
            Customers.Add(customer);
            SaveChanges();
        }
    }
}
